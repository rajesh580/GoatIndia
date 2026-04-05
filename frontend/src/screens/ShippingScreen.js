import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
  const { shippingAddress, saveShippingAddress } = useContext(CartContext);

  // SAFETY CHECK: Prevents crash if context is empty
  const safeAddress = shippingAddress || {};

  const [address, setAddress] = useState(safeAddress.address || '');
  const [city, setCity] = useState(safeAddress.city || '');
  const [postalCode, setPostalCode] = useState(safeAddress.postalCode || '');
  const [country, setCountry] = useState(safeAddress.country || '');

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/payment');
  };

  // --- STYLES ---
  const containerStyle = { padding: '60px 0', minHeight: '85vh', backgroundColor: '#fff' };
  
  const labelStyle = {
    fontSize: '11px',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: '#aaa',
    marginBottom: '10px',
    display: 'block'
  };

  const inputStyle = {
    borderRadius: '0px',
    border: '2px solid #000',
    padding: '15px',
    fontWeight: '700',
    fontSize: '14px',
    backgroundColor: '#fff',
    marginBottom: '20px'
  };

  const btnStyle = {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '0px',
    padding: '18px',
    fontWeight: '900',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    fontSize: '14px',
    marginTop: '20px',
    transition: '0.3s'
  };

  return (
    <Container style={containerStyle}>
      <CheckoutSteps step1 step2 />

      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h1 style={{ 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '-1px', 
            marginBottom: '40px',
            borderLeft: '10px solid #000',
            paddingLeft: '20px'
          }}>
            Shipping Dispatch
          </h1>

          <Form onSubmit={submitHandler}>
            <Form.Group controlId='address'>
              <Form.Label style={labelStyle}>Street Address</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter street name and house number'
                value={address}
                required
                style={inputStyle}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='city'>
              <Form.Label style={labelStyle}>City</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter city'
                value={city}
                required
                style={inputStyle}
                onChange={(e) => setCity(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='postalCode'>
              <Form.Label style={labelStyle}>Postal Code</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter postal code'
                value={postalCode}
                required
                style={inputStyle}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='country'>
              <Form.Label style={labelStyle}>Country</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter country'
                value={country}
                required
                style={inputStyle}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Form.Group>

            <Button 
              type='submit' 
              style={btnStyle} 
              className="w-100"
              onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
            >
              Continue to Payment —→
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ShippingScreen;