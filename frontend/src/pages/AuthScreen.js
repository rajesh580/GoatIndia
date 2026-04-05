import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Form, Button, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const AuthScreen = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect logic: Ensures we go to /shipping if coming from cart
  const redirect = location.search ? location.search.split('=')[1] : '/';
  const redirectPath = redirect.startsWith('/') ? redirect : `/${redirect}`;

  // 1. Manual Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/auth/login`, { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirectPath); 
    } catch (err) { 
      alert('Login Failed: Check your credentials'); 
    }
  };

  // 2. Google Login Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    
    try {
      const { data } = await axios.post(`/api/auth/google`, {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        image: decoded.picture
      });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirectPath);
    } catch (err) {
      alert('Google Login Failed');
    }
  };

  // 3. Manual Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/auth/signup`, { name, email, password });
      setIsFlipped(false);
      alert('Account created! Please login.');
    } catch (err) { 
      alert('Signup Failed'); 
    }
  };

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
      <Container className="d-flex justify-content-center align-items-center">
        <motion.div 
          drag 
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          style={{ cursor: 'grab' }}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
            style={{ transformStyle: 'preserve-3d', width: '400px', height: '550px' }}
          >
            {/* LOGIN SIDE (FRONT) */}
            <Card className="p-4 shadow-lg position-absolute w-100 h-100" 
                  style={{ backfaceVisibility: 'hidden', border: '2px solid #000', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}>
              <h2 className="text-center mb-4 fw-bold">GOAT INDIA LOGIN</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="r@e.com" onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="********" onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>
              <Button variant="dark" type="submit" className="w-100 mb-3">Login</Button>
              
              <div className="d-flex justify-content-center mb-3">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log('Login Failed')}
                />
              </div>

              <p className="text-center">New to GOAT? <span style={{color: 'blue', cursor: 'pointer'}} onClick={() => setIsFlipped(true)}>Sign Up</span></p>
            </Form>
          </Card>

          {/* SIGNUP SIDE (BACK) */}
          <Card className="p-4 shadow-lg position-absolute w-100 h-100" 
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', border: '2px solid #000', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}>
            <h2 className="text-center mb-4 fw-bold">JOIN THE GOAT</h2>
            <Form onSubmit={handleSignup}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Rajesh" onChange={(e) => setName(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="email@example.com" onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Min 6 characters" onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>
              <Button variant="dark" type="submit" className="w-100 mb-3">Create Account</Button>
              <p className="text-center">Already a member? <span style={{color: 'blue', cursor: 'pointer'}} onClick={() => setIsFlipped(false)}>Back to Login</span></p>
            </Form>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};

export default AuthScreen;