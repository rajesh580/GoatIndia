import React from 'react';
import { Container } from 'react-bootstrap';

const AboutScreen = () => {
  const blueprintStyle = {
    backgroundColor: '#f9f9f9',
    backgroundImage: 'linear-gradient(to right, #e8e8e8 1px, transparent 1px), linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    minHeight: '100vh',
    paddingTop: '60px',
    paddingBottom: '80px'
  };

  const contentCardStyle = {
    backgroundColor: '#fff',
    border: '4px solid #000',
    padding: '40px',
    boxShadow: '8px 8px 0px #000'
  };

  return (
    <div style={blueprintStyle}>
      <Container style={{ maxWidth: '800px' }}>
        <div style={contentCardStyle}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-2px', borderBottom: '4px solid #000', paddingBottom: '10px', marginBottom: '30px' }}>About GOAT INDIA</h1>
          <p style={{ fontSize: '15px', fontWeight: '500', color: '#333', lineHeight: '1.6', marginBottom: '15px' }}>
            GOAT INDIA is an architectural streetwear project designed in Bharat. We focus on premium heavyweight materials, brutalist aesthetics, and oversized silhouettes for the modern individual.
          </p>
          <div style={{ marginTop: '40px', borderTop: '2px dashed #000', paddingTop: '20px', textAlign: 'center' }}>
            <span style={{ fontWeight: '900', fontSize: '12px', letterSpacing: '2px' }}>[ END OF TRANSMISSION ]</span>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutScreen;