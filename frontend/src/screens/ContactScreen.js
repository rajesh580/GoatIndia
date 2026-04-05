import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ContactScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/api/contact`, { name, email, subject, message });
      setSuccess(true);
      setLoading(false);
      // Reset form
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message.');
      setLoading(false);
    }
  };

  const labelStyle = { fontWeight: '900', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' };
  const inputStyle = { borderRadius: '0', border: '2px solid #000', padding: '15px', fontWeight: '700', marginBottom: '20px' };

  const blueprintStyle = {
    backgroundColor: '#f9f9f9',
    backgroundImage: 'linear-gradient(to right, #e8e8e8 1px, transparent 1px), linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    minHeight: '100vh'
  };
  return (
    <div style={blueprintStyle}>
      <style>{`@keyframes terminalBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } } .terminal-cursor { animation: terminalBlink 1s step-end infinite; color: #ff0000; display: inline-block; }`}</style>
      <Container className="py-5" style={{ maxWidth: '1000px' }}>
      <div className="mb-5">
        <h1 style={{ fontWeight: '900', fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', textTransform: 'uppercase', letterSpacing: '-1.5px', marginBottom: '10px' }}>
          Get In Touch
        </h1>
        <p style={{ fontWeight: '700', color: '#555', fontSize: '1.2rem', letterSpacing: '1px' }}>
          WE'RE HERE TO HELP THE GOAT COMMUNITY.
        </p>
      </div>

      {success && <Alert variant="success" className="rounded-0 fw-bold border-2 border-dark">MESSAGE SENT! WE'LL GET BACK TO YOU SOON.</Alert>}
      {error && <Alert variant="danger" className="rounded-0 fw-bold border-2 border-dark">{error}</Alert>}

      <Row>
        <Col md={5} className="mb-5 pr-md-4">
          <div style={{ paddingRight: '20px' }}>
            <h3 style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Headquarters</h3>
            <p style={{ fontWeight: '600', color: '#444', lineHeight: '1.8' }}>
              GOAT INDIA STUDIO<br/>
              123 Streetwear Avenue<br/>
              Bengaluru, Karnataka 560001<br/>
              India
            </p>

            <h3 style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '40px', marginBottom: '20px' }}>Direct Lines</h3>
            <p style={{ fontWeight: '600', color: '#444', lineHeight: '1.8', margin: 0 }}>
              <strong style={{ color: '#000' }}>EMAIL:</strong> support@goatindia.com
            </p>
            <p style={{ fontWeight: '600', color: '#444', lineHeight: '1.8', margin: 0 }}>
              <strong style={{ color: '#000' }}>PHONE:</strong> +91 98765 43210
            </p>
            <p style={{ fontWeight: '600', color: '#444', lineHeight: '1.8', margin: 0 }}>
              <strong style={{ color: '#000' }}>HOURS:</strong> Mon - Fri | 10:00 - 18:00
            </p>
          </div>
        </Col>

        <Col md={7}>
          <Form onSubmit={submitHandler} style={{ border: '4px solid #000', padding: '40px', backgroundColor: '#fff', boxShadow: '8px 8px 0px #000' }}>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Your Name</Form.Label>
                  <Form.Control style={inputStyle} type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="JOHN DOE" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Email Address</Form.Label>
                  <Form.Control style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="JOHN@EXAMPLE.COM" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group>
              <Form.Label style={labelStyle}>Subject</Form.Label>
              <Form.Control style={inputStyle} type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="ORDER INQUIRY" />
            </Form.Group>

            <Form.Group>
              <Form.Label style={labelStyle}>Message</Form.Label>
              <Form.Control as="textarea" rows={5} style={{...inputStyle, resize: 'none'}} value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="How can we help?" />
            </Form.Group>

            <Button type="submit" variant="dark" className="w-100 py-3 rounded-0 fw-bold mt-3" disabled={loading} style={{ letterSpacing: '2px', fontSize: '14px' }}>
              {loading ? <span>[ TRANSMITTING <span className="terminal-cursor">█</span> ]</span> : 'TRANSMIT MESSAGE'}
            </Button>
          </Form>
        </Col>
      </Row>
      </Container>
    </div>
  );
};

export default ContactScreen;