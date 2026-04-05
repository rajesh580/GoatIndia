import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col, Container } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = () => {
  const navigate = useNavigate();
  
  const shippingAddress = localStorage.getItem('shippingAddress') 
    ? JSON.parse(localStorage.getItem('shippingAddress')) 
    : null;

  if (!shippingAddress) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
    navigate('/placeorder');
  };

  // --- INLINE STYLE OBJECTS ---
  const containerStyle = {
    padding: '40px 0',
    minHeight: '80vh',
    maxWidth: '600px' // Keeps the payment form centered and clean
  };

  const titleStyle = {
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '-1.5px',
    marginBottom: '30px',
    borderBottom: '5px solid #000',
    display: 'inline-block'
  };

  const optionBoxStyle = (method) => ({
    border: paymentMethod === method ? '3px solid #000' : '1px solid #ddd',
    padding: '20px',
    marginBottom: '15px',
    cursor: 'pointer',
    transition: '0.3s ease',
    backgroundColor: paymentMethod === method ? '#fdfdfd' : '#fff',
    display: 'flex',
    alignItems: 'center'
  });

  const continueBtnStyle = {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '0',
    padding: '15px',
    fontWeight: '800',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginTop: '20px',
    transition: '0.3s'
  };

  return (
    <Container style={containerStyle}>
      <style>
        {`
          .payment-option:hover {
            border-color: #000 !important;
            transform: translateY(-2px);
          }
          .custom-radio {
            width: 20px;
            height: 20px;
            border: 2px solid #000;
            border-radius: 50%;
            margin-right: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .custom-radio-inner {
            width: 10px;
            height: 10px;
            background-color: #000;
            border-radius: 50%;
            display: ${paymentMethod ? 'block' : 'none'};
          }
        `}
      </style>

      <CheckoutSteps step1 step2 step3 />

      <div className="mt-5">
        <h1 style={titleStyle}>Payment Method</h1>
        <p style={{ fontWeight: '600', color: '#888', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
          Select your preferred way to pay
        </p>

        <Form onSubmit={submitHandler} className="mt-4">
          <Form.Group>
            <Col>
              {/* UPI Option */}
              <div 
                style={optionBoxStyle('UPI')} 
                className="payment-option"
                onClick={() => setPaymentMethod('UPI')}
              >
                <div className="custom-radio">
                  {paymentMethod === 'UPI' && <div className="custom-radio-inner"></div>}
                </div>
                <div>
                  <div style={{ fontWeight: '900', fontSize: '16px' }}>UPI / SCANNER</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Google Pay, PhonePe, or Any UPI App</div>
                </div>
              </div>

              {/* COD Option */}
              <div 
                style={optionBoxStyle('COD')} 
                className="payment-option"
                onClick={() => setPaymentMethod('COD')}
              >
                <div className="custom-radio">
                  {paymentMethod === 'COD' && <div className="custom-radio-inner"></div>}
                </div>
                <div>
                  <div style={{ fontWeight: '900', fontSize: '16px' }}>CASH ON DELIVERY</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Pay when your GOAT gear arrives</div>
                </div>
              </div>
            </Col>
          </Form.Group>

          <Button 
            type='submit' 
            style={continueBtnStyle} 
            className="w-100"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
          >
            Review Order Details
          </Button>
        </Form>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" 
          alt="UPI" 
          className="grayscale-img"
          style={{ height: '20px', opacity: '0.5' }}
        />
      </div>
    </Container>
  );
};

export default PaymentScreen;