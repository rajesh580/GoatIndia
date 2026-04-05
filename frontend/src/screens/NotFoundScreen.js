import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const NotFoundScreen = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: 'clamp(6rem, 15vw, 10rem)', fontWeight: '900', margin: 0, lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '30px' }}>
        System Archival Failure
      </h2>
      <p style={{ color: '#888', fontWeight: '700', marginBottom: '40px', maxWidth: '500px', letterSpacing: '1px' }}>
        THE DROP YOU ARE LOOKING FOR DOES NOT EXIST OR HAS BEEN PERMANENTLY REMOVED FROM THE ARCHIVE.
      </p>
      <Link 
        to="/" 
        className="btn btn-dark rounded-0"
        style={{ padding: '15px 30px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}
      >
        Return to Base
      </Link>
    </Container>
  );
};

export default NotFoundScreen;