import React from 'react';
import { Container, Card } from 'react-bootstrap';

const OurStory = () => {
  return (
    <Container className="py-5 text-center" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontWeight: '900', fontSize: '3rem', textTransform: 'uppercase', letterSpacing: '-1px', marginBottom: '40px' }}>
        The Origin
      </h1>
      <Card className="p-5" style={{ borderRadius: '0', border: '4px solid #000', backgroundColor: '#fff', boxShadow: '8px 8px 0px #000' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: '900', fontStyle: 'italic', marginBottom: '30px', borderBottom: '2px dashed #eee', paddingBottom: '30px' }}>
          "It started with a simple vision in a college dorm..."
        </p>
        <p style={{ fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.8', color: '#333' }}>
          As Computer Science students, we wanted to bridge the gap between tech culture 
          and street fashion. GOAT INDIA was born from the idea that 
          greatness isn't given—it's built through late-night coding sessions and 
          relentless hustle.
        </p>
        <p style={{ fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.8', color: '#333', margin: 0 }}>
          Today, we serve customers across India, delivering quality hoodies and 
          oversized tees that represent the GOAT mindset.
        </p>
      </Card>
    </Container>
  );
};

export default OurStory;