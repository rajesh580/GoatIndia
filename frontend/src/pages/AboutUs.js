import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const AboutUs = () => {
  return (
    <Container className="py-5">
      <Row className="align-items-center">
        <Col md={6}>
          <h1 style={{ fontWeight: '900', fontSize: '3rem', textTransform: 'uppercase', borderBottom: '6px solid #000', display: 'inline-block', marginBottom: '30px' }}>
            About Us
          </h1>
          <p style={{ fontSize: '1.2rem', fontWeight: '700', lineHeight: '1.6', marginBottom: '20px' }}>
            GOAT INDIA is more than just a clothing brand; it's a movement for those 
            who strive to be the "Greatest Of All Time" in their own journey.
          </p>
          <p style={{ fontSize: '1rem', fontWeight: '500', color: '#555', lineHeight: '1.8' }}>
            Based in Karnataka, we specialize in high-quality streetwear that combines 
            comfort with a bold aesthetic. Our mission is to provide 
            premium apparel that empowers our community to express their unique identity.
          </p>
        </Col>
        <Col md={6}>
          <div style={{ border: '4px solid #000', padding: '15px', backgroundColor: '#fff', transform: 'rotate(2deg)' }}>
            <Image src="/images/about-goat.jpg" alt="GOAT India Team" fluid style={{ border: '2px solid #000' }} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;