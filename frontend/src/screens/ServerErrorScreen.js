import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const ServerErrorScreen = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: 'clamp(6rem, 15vw, 10rem)', fontWeight: '900', margin: 0, lineHeight: 1, color: '#ff4444' }}>500</h1>
      <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '30px' }}>
        Critical System Error
      </h2>
      <p style={{ color: '#888', fontWeight: '700', marginBottom: '40px', maxWidth: '500px', letterSpacing: '1px' }}>
        OUR SERVERS ARE CURRENTLY EXPERIENCING OVERWHELMING LOAD OR A FATAL ERROR HAS OCCURRED. PLEASE STAND BY.
      </p>
      <Link 
        to="/" 
        className="btn btn-dark rounded-0"
        style={{ padding: '15px 30px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}
      >
        Reboot System
      </Link>
    </Container>
  );
};

export default ServerErrorScreen;