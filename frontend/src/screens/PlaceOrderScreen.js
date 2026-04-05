import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';
import toast from 'react-hot-toast';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};
  const paymentMethod = JSON.parse(localStorage.getItem('paymentMethod')) || 'Not Selected';

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 50; 
  const totalPrice = itemsPrice + shippingPrice;

  const isCOD = paymentMethod.toUpperCase() === 'COD' || paymentMethod.toLowerCase() === 'cash on delivery';

  const placeOrderHandler = async () => {
    const orderDataBase = {
      userEmail: userInfo.email,
      orderItems: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        size: item.size // MANDATORY: Passing size to backend
      })),
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod, 
      totalPrice: totalPrice,
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    if (isCOD) {
      try {
        const { data } = await axios.post(`/api/orders`, {
          ...orderDataBase,
          isPaid: false 
        }, config);
        localStorage.removeItem('cartItems');
        navigate(`/order/${data.id}`);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error placing COD order');
      }
      return; 
    }

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) { toast.error("Payment Gateway Initialization Failed."); return; }

    try {
      // 1. Create the pending order locally BEFORE opening Razorpay
      const { data: createdOrder } = await axios.post(`/api/orders`, {
        ...orderDataBase,
        isPaid: false 
      }, config);

      // 2. Init Razorpay Order passing the local orderId
      const { data: razorpayOrder } = await axios.post(`/api/orders/razorpay`, { 
        amount: Math.round(totalPrice),
        receipt: `receipt_${createdOrder.id}`,
        orderId: createdOrder.id
      }, config);

      const options = {
        key: "rzp_test_SMlGgERPqcopKV", 
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "GOAT INDIA", 
        description: "Secure Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const { data: verifyData } = await axios.post(`/api/orders/razorpay/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: createdOrder.id
            }, config);

            if (verifyData.success) {
              localStorage.removeItem('cartItems');
              navigate(`/order/${createdOrder.id}`);
            }
          } catch (error) {
            toast.error('Transaction Verification Failed.');
            // Even if frontend fails, the webhook will save the payment status!
            navigate(`/order/${createdOrder.id}`);
          }
        },
        prefill: { name: userInfo.name || "Customer", email: userInfo.email },
        theme: { color: "#000000" }, 
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response){
        toast.error('Payment Failed or Cancelled.');
        navigate(`/order/${createdOrder.id}`);
      });

      paymentObject.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error initializing payment.');
    }
  };

  const headerStyle = { fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-1px', borderBottom: '5px solid #000', display: 'inline-block', marginBottom: '30px' };
  const sectionLabelStyle = { fontSize: '11px', fontWeight: '800', letterSpacing: '2px', color: '#888', textTransform: 'uppercase', marginBottom: '5px', display: 'block' };
  const summaryCardStyle = { borderRadius: '0', border: '3px solid #000', padding: '25px', backgroundColor: '#fff' };

  return (
    <Container className="py-5">
      <CheckoutSteps step1 step2 step3 step4 />
      <Row className="mt-5">
        <Col md={8}>
          <h2 style={headerStyle}>Final Review</h2>
          <ListGroup variant='flush'>
            <ListGroup.Item className="border-0">
              <span style={sectionLabelStyle}>Shipping Destination</span>
              <p style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{userInfo.name.toUpperCase()}</p>
              <p className="text-muted mb-0">{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}</p>
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <span style={sectionLabelStyle}>Selected Payment</span>
              <p style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>{paymentMethod.toUpperCase()}</p>
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <span style={sectionLabelStyle}>Product Manifest</span>
              {cartItems.map((item, index) => (
                <Row key={index} className="align-items-center py-3 border-bottom">
                  <Col md={2}><Image src={item.image} alt={item.name} fluid /></Col>
                  <Col md={6}>
                    <Link to={`/product/${item.id}`} className="text-dark fw-bold text-uppercase d-block">{item.name}</Link>
                    <div className="d-flex gap-3 mt-1">
                       <span className="badge bg-dark rounded-0">SIZE: {item.size}</span>
                       <span className="text-muted fw-bold small">QTY: {item.qty}</span>
                    </div>
                  </Col>
                  <Col md={4} className="text-end fw-bold">₹{(item.qty * item.price).toFixed(2)}</Col>
                </Row>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card style={summaryCardStyle}>
            <h3 className="fw-black text-center mb-4">ORDER TOTAL</h3>
            <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><strong>₹{itemsPrice.toFixed(2)}</strong></div>
            <div className="d-flex justify-content-between mb-4"><span>Shipping</span><strong>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</strong></div>
            <div className="border-top pt-3 d-flex justify-content-between mb-4">
              <span className="h4 fw-black">TOTAL</span><span className="h4 fw-black">₹{totalPrice.toFixed(2)}</span>
            </div>
            <Button className='btn-dark w-100 rounded-0 py-3 fw-bold' disabled={cartItems.length === 0} onClick={placeOrderHandler}>
              {isCOD ? 'Confirm COD Order' : 'Pay with Razorpay'}
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrderScreen;