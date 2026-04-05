import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Spinner, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(''); // Stores the code from the server
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Initialize navigate

  const requestOtpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`/api/auth/signup-otp`, { email });
      setGeneratedOtp(data.otp); // Captures the 6-digit code
      setStep(2);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setLoading(false);
    }
  };

  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/auth/signup`, { 
        name, 
        email, 
        password, 
        otp, 
        generatedOtp 
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or Expired OTP');
      setLoading(false);
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/auth/login`, { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      window.location.href = data.isAdmin ? '/admin/products' : '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Login Failed');
      setLoading(false);
    }
  };

  const googleSuccess = async (res) => {
    const details = jwtDecode(res.credential);
    try {
      const { data } = await axios.post(`/api/auth/google`, {
        name: details.name,
        email: details.email,
        googleId: details.sub
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      window.location.href = '/';
    } catch (err) {
      setError('Google Login Failed');
    }
  };

  const labelStyle = { fontWeight: '800', fontSize: '12px', letterSpacing: '1px' };
  const inputStyle = { borderRadius: '0', border: '2px solid #000', padding: '12px' };

  return (
    <div className="animated-bg" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
      <style>
        {`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animated-bg {
            background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
            background-size: 400% 400%;
            animation: gradientAnimation 15s ease infinite;
            width: 100%;
          }
        `}
      </style>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={5} style={{ border: '4px solid #000', padding: '40px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}>
            <h1 className="text-center mb-4" style={{ fontWeight: '900', letterSpacing: '2px' }}>
              {step === 1 ? (isSignup ? 'CREATE ACCOUNT' : 'SIGN IN') : 'VERIFY EMAIL'}
            </h1>
          
          {error && <Alert variant="danger" className="rounded-0 fw-bold">{error}</Alert>}

          <Form onSubmit={isSignup ? (step === 1 ? requestOtpHandler : verifyOtpHandler) : loginHandler}>
            {step === 1 && (
              <>
                {isSignup && (
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>FULL NAME</Form.Label>
                    <Form.Control style={inputStyle} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                  </Form.Group>
                )}
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>EMAIL ADDRESS</Form.Label>
                  <Form.Control style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label style={labelStyle}>PASSWORD</Form.Label>
                  <Form.Control style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>

                {/* --- FORGOT PASSWORD LINK --- */}
                {!isSignup && (
                  <div className="text-end mb-4">
                    <Button 
                      variant="link" 
                      onClick={() => navigate('/forgot-password')}
                      className="p-0 text-dark fw-bold text-decoration-none" 
                      style={{ fontSize: '11px' }}
                    >
                      FORGOT PASSWORD?
                    </Button>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <Form.Group className="mb-4 text-center">
                <Form.Label style={labelStyle}>ENTER 6-DIGIT CODE</Form.Label>
                <Form.Control 
                  style={{ ...inputStyle, textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }} 
                  type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required 
                />
              </Form.Group>
            )}

            <Button type="submit" variant="dark" className="w-100 py-3 rounded-0 fw-bold" disabled={loading}>
              {loading ? <Spinner size="sm" /> : (isSignup ? (step === 1 ? 'SEND OTP' : 'VERIFY & REGISTER') : 'SIGN IN')}
            </Button>
          </Form>

          {step === 1 && (
            <div className="text-center mt-4">
              <div className="d-flex justify-content-center mb-3">
                <GoogleLogin onSuccess={googleSuccess} theme="filled_black" shape="square" />
              </div>
              <Button variant="link" className="text-dark fw-bold text-decoration-none" onClick={() => { setIsSignup(!isSignup); setStep(1); setError(''); }}>
                {isSignup ? 'ALREADY A MEMBER? SIGN IN' : 'NEW TO GOAT INDIA? SIGN UP'}
              </Button>
            </div>
          )}
        </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;