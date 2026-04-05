import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPasswordScreen = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Step 1: Request OTP
  const sendOtpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/api/auth/forgot-password`, { email });
      setStep(2);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Email not found');
      setLoading(false);
    }
  };

  // Step 2 & 3: Verify OTP and Reset Password
  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/api/auth/reset-password`, {
        email,
        otp,
        newPassword: password
      });
      toast.success('Password reset successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or Expired OTP');
      setLoading(false);
    }
  };

  // --- STYLES ---
  const containerStyle = { padding: '80px 0', width: '100%' };
  const cardStyle = { border: '4px solid #000', padding: '40px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' };
  const labelStyle = { fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa', marginBottom: '10px' };
  const inputStyle = { borderRadius: '0', border: '2px solid #000', padding: '15px', fontWeight: '700' };
  const btnStyle = { backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '0', padding: '15px', fontWeight: '900', letterSpacing: '2px' };

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
      <Container style={containerStyle}>
        <Row className="justify-content-md-center">
          <Col xs={12} md={5}>
            <div style={cardStyle}>
              <h2 style={{ fontWeight: '900', textTransform: 'uppercase', marginBottom: '30px', letterSpacing: '-1px' }}>
                {step === 1 ? 'Recover Account' : step === 2 ? 'Verify OTP' : 'New Identity'}
              </h2>

            {step === 1 && (
              <Form onSubmit={sendOtpHandler}>
                <Form.Group className="mb-4">
                  <Form.Label style={labelStyle}>Registered Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                </Form.Group>
                <Button type="submit" style={btnStyle} className="w-100" disabled={loading}>
                  {loading ? 'SENDING...' : 'SEND OTP'}
                </Button>
              </Form>
            )}

            {step === 2 && (
              <Form onSubmit={() => setStep(3)}>
                <p style={{ fontSize: '12px', fontWeight: '700' }}>OTP sent to {email}</p>
                <Form.Group className="mb-4">
                  <Form.Label style={labelStyle}>Enter 6-Digit OTP</Form.Label>
                  <Form.Control type="text" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} required style={inputStyle} maxLength="6" />
                </Form.Group>
                <Button onClick={() => setStep(3)} style={btnStyle} className="w-100">VERIFY & PROCEED</Button>
              </Form>
            )}

            {step === 3 && (
              <Form onSubmit={resetPasswordHandler}>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>New Password</Form.Label>
                  <Form.Control type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label style={labelStyle}>Confirm Password</Form.Label>
                  <Form.Control type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={inputStyle} />
                </Form.Group>
                <Button type="submit" style={btnStyle} className="w-100" disabled={loading}>
                  {loading ? 'RESETTING...' : 'UPDATE PASSWORD'}
                </Button>
              </Form>
            )}
          </div>
        </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPasswordScreen;