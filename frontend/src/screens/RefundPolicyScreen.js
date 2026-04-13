import React from 'react';
import { Container } from 'react-bootstrap';

const RefundPolicyScreen = () => {
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
          <h1 style={headerStyle}>Refund Policy</h1>
          <p style={{ ...textStyle, fontWeight: '700' }}>LAST UPDATED: [CURRENT DATE]</p>
          
          <h2 style={sectionTitleStyle}>1. Returns</h2>
          <p style={textStyle}>We accept returns within 7 days of delivery. To be eligible for a return, your item must be unused, unworn, and in the exact same condition that you received it. It must also be in the original GOAT INDIA packaging with all tags attached.</p>

          <h2 style={sectionTitleStyle}>2. Exchanges</h2>
          <p style={textStyle}>We only replace items if they are defective, damaged, or if an incorrect size was shipped by us. If you need to exchange an item for the same product, contact our support team at support@goatindia.com.</p>

          <h2 style={sectionTitleStyle}>3. Refunds</h2>
          <p style={textStyle}>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.</p>

          <h2 style={sectionTitleStyle}>4. Order Cancellations</h2>
          <p style={textStyle}>Orders can only be cancelled while they are in the "PENDING" state. Once an order enters "PREPARING FOR DISPATCH" or has been shipped, it can no longer be cancelled and must be processed as a standard return upon delivery.</p>

          <h2 style={sectionTitleStyle}>5. Return Shipping</h2>
          <p style={textStyle}>You will be responsible for paying your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>
          
          <div style={{ marginTop: '40px', borderTop: '2px dashed #000', paddingTop: '20px', textAlign: 'center' }}>
            <span style={{ fontWeight: '900', fontSize: '12px', letterSpacing: '2px' }}>[ GOAT INDIA // RETURNS LOG ]</span>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RefundPolicyScreen;