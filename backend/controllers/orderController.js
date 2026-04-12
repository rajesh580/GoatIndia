const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem'); // Added this import
const Razorpay = require('razorpay');
const crypto = require('crypto');

const markRazorpayOrderCancelled = async (order, cancelReason) => {
  if (!order) {
    return;
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.isCancelled = true;
  order.cancelReason = cancelReason || order.cancelReason || 'Auto-cancelled after successful Razorpay payment';
  order.status = 4;
  await order.save();
};

const markRazorpayOrderPaid = async (order, actualMethod) => {
  if (!order) {
    return;
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentMethod = actualMethod === 'upi'
    ? 'Razorpay / UPI'
    : `Razorpay / ${String(actualMethod || 'UNKNOWN').toUpperCase()}`;
  order.isCancelled = false;
  order.cancelReason = null;
  await order.save();
};

const reconcileRazorpayPaymentMethod = async ({ order, razorpayPaymentId, paymentEntity }) => {
  if (!order) {
    return;
  }

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const payment = paymentEntity || await instance.payments.fetch(razorpayPaymentId);
  const actualMethod = String(payment?.method || '').toLowerCase();
  const expectedMethod = String(order.paymentMethod || '').toLowerCase();
  const expectsUpi = expectedMethod === 'upi' || expectedMethod.includes('upi');

  if (expectsUpi && actualMethod !== 'upi') {
    await markRazorpayOrderCancelled(
      order,
      `Auto-cancelled: expected UPI payment but received ${actualMethod || 'unknown'}`
    );
    return;
  }

  await markRazorpayOrderPaid(order, actualMethod);
};

// @desc    Create new order (Supports both COD and Razorpay flows)
// @route   POST /api/orders
exports.addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice, isPaid } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // 1. Create the Main Order
    const order = await Order.create({
      userEmail: req.body.userEmail || (req.user && req.user.email),
      // We still store stringified data for quick history lookups
      items: JSON.stringify(orderItems),
      shippingAddress: JSON.stringify(shippingAddress),
      paymentMethod,
      totalPrice,
      status: 0, // 0: PENDING
      isPaid: isPaid || false, 
      paidAt: isPaid ? Date.now() : null,
    });

    // 2. Create individual OrderItems (This is where SIZE is saved properly)
    const itemsToInsert = orderItems.map(item => ({
      orderId: order.id,
      productId: item.id,
      quantity: item.qty,
      size: item.size || 'N/A', // Capturing size from frontend
      price: item.price
    }));

    await OrderItem.bulkCreate(itemsToInsert);

    res.status(201).json(order);
  } catch (error) {
    console.error("Database Insert Error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update order status (ADMIN ONLY)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      order.status = req.body.status;
      if (Number(req.body.status) === 4) {
        order.deliveredAt = Date.now();
        const method = order.paymentMethod.toUpperCase();
        if (method === 'COD' || method === 'CASH ON DELIVERY') {
          order.isPaid = true;
          order.paidAt = Date.now();
        }
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get logged in user orders
exports.getMyOrders = async (req, res) => {
  try {
    const email = (req.user && req.user.email) || req.query.email;
    if (!email) {
      return res.json([]);
    }

    const orders = await Order.findAll({ 
      where: { userEmail: email },
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders', error: error.message });
  }
};

// @desc    Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      order.isCancelled = true;
      order.cancelReason = req.body.cancelReason;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- RAZORPAY LOGIC ---

exports.createRazorpayOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amountInPaise = Math.round(Number(req.body.amount) * 100);
    const options = {
      amount: amountInPaise, 
      currency: "INR",
      receipt: req.body.receipt || `receipt_${Date.now()}`,
      notes: {
        orderId: req.body.orderId
      }
    };
    const razorpayOrder = await instance.orders.create(options);
    res.json(razorpayOrder);
  } catch (error) {
    res.status(500).json({ message: 'Razorpay initialization failed', error: error.message });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET) 
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      if (orderId) {
        const order = await Order.findByPk(orderId);
        if (order) {
          await reconcileRazorpayPaymentMethod({
            order,
            razorpayPaymentId: razorpay_payment_id
          });
        }
      }
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Webhook to handle async Razorpay payment events
exports.razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      return res.status(200).send('Webhook secret not configured');
    }
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature === signature) {
      const event = req.body.event;
      const paymentEntity = req.body.payload.payment.entity;
      const orderIdStr = paymentEntity.notes?.orderId;
      
      if (orderIdStr && event === 'payment.captured') {
        const order = await Order.findByPk(orderIdStr);
        if (order && !order.isPaid) {
          await reconcileRazorpayPaymentMethod({ order, paymentEntity });
        }
      }
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(400).json({ status: 'error', message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Server Error');
  }
};