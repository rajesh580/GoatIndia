import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

const SettingsScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordStep, setPasswordStep] = useState(1); 
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      // We only send the name now, as email is read-only
      const { data } = await axios.put(`/api/auth/profile`, { name, email }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setMessage('Profile updated successfully');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const requestOtpHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`/api/auth/forgot-password`, { email: userInfo.email });
      setMessage(data.message);
      setPasswordStep(2);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const verifyPasswordHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/auth/reset-password`, {
        email: userInfo.email,
        otp,
        newPassword
      });
      setMessage(data.message);
      setPasswordStep(1);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const headerStyle = { fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-1.5px', marginBottom: '10px' };
  const subLabelStyle = { fontSize: '11px', fontWeight: '800', letterSpacing: '2px', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '30px' };
  const labelStyle = { fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' };
  const inputStyle = { borderRadius: '0', border: '1px solid #000', padding: '12px', fontWeight: '600', fontSize: '14px' };
  
  // Style for the locked email field
  const readOnlyInputStyle = { ...inputStyle, backgroundColor: '#f9f9f9', cursor: 'not-allowed', color: '#666', border: '1px solid #ccc' };
  
  const blackBtnStyle = { backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '0', padding: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' };

  const blueprintStyle = {
    backgroundColor: '#f9f9f9',
    backgroundImage: 'linear-gradient(to right, #e8e8e8 1px, transparent 1px), linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    minHeight: '100vh'
  };

  return (
    <div style={blueprintStyle}>
      <style>{`@keyframes terminalBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } } .terminal-cursor { animation: terminalBlink 1s step-end infinite; color: #ff0000; display: inline-block; }`}</style>
      <Container className="py-5" style={{ maxWidth: '600px' }}>
      <div className="text-center mb-5">
        <h1 style={headerStyle}>Settings</h1>
        <span style={subLabelStyle}>Manage your member identity</span>
      </div>

      {error && <Alert variant="danger" className="rounded-0">{error}</Alert>}
      {message && <Alert variant="success" className="rounded-0">{message}</Alert>}

      <Form onSubmit={updateProfileHandler}>
        <Form.Group className="mb-4">
          <Form.Label style={labelStyle}>Full Name</Form.Label>
          <Form.Control style={inputStyle} type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label style={labelStyle}>Email Address (Verified)</Form.Label>
          <Form.Control 
            style={readOnlyInputStyle} 
            type="email" 
            value={email} 
            readOnly // This prevents editing
          />
        </Form.Group>

        <Button type="submit" style={blackBtnStyle} className="w-100 mb-5">
          {loading && passwordStep === 1 ? <span>[ PROCESSING <span className="terminal-cursor">█</span> ]</span> : 'Save Changes'}
        </Button>
      </Form>

      <hr style={{ borderTop: '2px solid #eee', marginBottom: '40px' }} />

      <div className="security-section">
        <h3 style={{ ...labelStyle, fontSize: '14px', color: '#000', marginBottom: '20px' }}>Security & Privacy</h3>
        
        {passwordStep === 1 ? (
          <Button variant="outline-dark" className="rounded-0 w-100 fw-bold py-3" onClick={requestOtpHandler} disabled={loading}>
            {loading && passwordStep === 1 ? <span>[ PROCESSING <span className="terminal-cursor">█</span> ]</span> : 'Change Password via Email OTP'}
          </Button>
        ) : (
          <Form onSubmit={verifyPasswordHandler}>
            <Form.Group className="mb-3">
              <Form.Label style={labelStyle}>Enter 6-Digit OTP</Form.Label>
              <Form.Control style={inputStyle} type="text" placeholder="Check your email" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={labelStyle}>New Password</Form.Label>
              <Form.Control style={inputStyle} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={labelStyle}>Confirm New Password</Form.Label>
              <Form.Control style={inputStyle} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </Form.Group>
            <Button type="submit" style={blackBtnStyle} className="w-100">
              {loading && passwordStep === 2 ? <span>[ PROCESSING <span className="terminal-cursor">█</span> ]</span> : 'Update Password'}
            </Button>
            <Button variant="link" className="w-100 text-dark mt-2 fw-bold text-decoration-none" style={{ fontSize: '12px' }} onClick={() => setPasswordStep(1)}>
              Cancel
            </Button>
          </Form>
        )}
      </div>
      </Container>
    </div>
  );
};

export default SettingsScreen;