const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem'); // Added this import
const Razorpay = require('razorpay');
const crypto = require('crypto');

// @desc    Create new order (Supports both COD and Razorpay flows)
// @route   POST /api/orders
exports.addOrderItems = async (req, res) => {
  const { userEmail, orderItems, shippingAddress, paymentMethod, totalPrice, isPaid } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // 1. Create the Main Order
    const order = await Order.create({
      userEmail, 
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
    const orders = await Order.findAll({ 
      where: { userEmail: req.user.email },
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
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentMethod = 'Razorpay / UPI';
          await order.save();
        }
      }
      res.json({ success: true, paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};

// @desc    Razorpay Webhook Handler
// @route   POST /api/orders/razorpay/webhook
exports.razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    const event = req.body.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = req.body.payload.payment.entity;
      const orderId = payment.notes?.orderId;
      
      if (orderId) {
        const order = await Order.findByPk(orderId);
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentMethod = 'Razorpay / UPI';
          await order.save();
        }
      }
    }
    res.json({ status: 'ok' });
  } else {
    res.status(400).send('Invalid signature');
  }
};