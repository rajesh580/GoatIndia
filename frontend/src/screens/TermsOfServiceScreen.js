import React from 'react';
import { Container } from 'react-bootstrap';

const TermsOfServiceScreen = () => {
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

  const headerStyle = { fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-2px', borderBottom: '4px solid #000', paddingBottom: '10px', marginBottom: '30px' };
  const sectionTitleStyle = { fontSize: '1.2rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '30px', marginBottom: '10px' };
  const textStyle = { fontSize: '15px', fontWeight: '500', color: '#333', lineHeight: '1.6', marginBottom: '15px' };

  return (
    <div style={blueprintStyle}>
      <Container style={{ maxWidth: '800px' }}>
        <div style={contentCardStyle}>
          <h1 style={headerStyle}>Terms of Service</h1>
          <p style={{ ...textStyle, fontWeight: '700' }}>LAST UPDATED: [CURRENT DATE]</p>
          
          <p style={textStyle}>Welcome to GOAT INDIA. By accessing or using our website, you agree to be bound by these Terms of Service.</p>

          <h2 style={sectionTitleStyle}>1. Use of the Platform</h2>
          <p style={textStyle}>You must be at least 18 years old to make a purchase on our platform. You agree to provide accurate and complete information when creating an account or placing an order.</p>

          <h2 style={sectionTitleStyle}>2. Product Availability & Pricing</h2>
          <p style={textStyle}>All drops are subject to availability. We reserve the right to limit the quantities of any products we offer. Prices for our products are subject to change without notice. In the event of a pricing error, we reserve the right to cancel any orders placed for the incorrectly priced item.</p>

          <h2 style={sectionTitleStyle}>3. Intellectual Property</h2>
          <p style={textStyle}>All content included on this site, such as brutalist architecture, graphics, logos, images, and text, is the property of GOAT INDIA and protected by international copyright laws. Unauthorized reproduction or redistribution is strictly prohibited.</p>

          <h2 style={sectionTitleStyle}>4. User Comments and Reviews</h2>
          <p style={textStyle}>If you leave a review or comment on our platform, you grant us the right to use, edit, and publish it. We reserve the right to remove any reviews that contain offensive, abusive, or spam material.</p>

          <h2 style={sectionTitleStyle}>5. Limitation of Liability</h2>
          <p style={textStyle}>GOAT INDIA shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our products or services.</p>

          <h2 style={sectionTitleStyle}>6. Governing Law</h2>
          <p style={textStyle}>These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of India.</p>
          
          <div style={{ marginTop: '40px', borderTop: '2px dashed #000', paddingTop: '20px', textAlign: 'center' }}>
            <span style={{ fontWeight: '900', fontSize: '12px', letterSpacing: '2px' }}>[ GOAT INDIA // LEGAL DEPT ]</span>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TermsOfServiceScreen;