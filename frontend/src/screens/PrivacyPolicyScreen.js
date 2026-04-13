import React from 'react';
import { Container } from 'react-bootstrap';

const PrivacyPolicyScreen = () => {
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
          <h1 style={headerStyle}>Privacy Policy</h1>
          <p style={{ ...textStyle, fontWeight: '700' }}>LAST UPDATED: [CURRENT DATE]</p>
          
          <h2 style={sectionTitleStyle}>1. Information We Collect</h2>
          <p style={textStyle}>We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This may include your name, email address, shipping address, payment method details, and sizing preferences.</p>

          <h2 style={sectionTitleStyle}>2. How We Use Your Information</h2>
          <p style={textStyle}>We use the collected information to process and fulfill your orders, send you shipping confirmations, respond to your customer service requests, and (if you opt-in) send you updates about new drops and exclusive GOAT INDIA releases.</p>

          <h2 style={sectionTitleStyle}>3. Information Sharing</h2>
          <p style={textStyle}>We do not sell your personal data. We only share your information with trusted third-party service providers (such as Razorpay for secure payments and our shipping partners) strictly for the purpose of fulfilling your order.</p>

          <h2 style={sectionTitleStyle}>4. Cookies and Tracking</h2>
          <p style={textStyle}>We use cookies and similar tracking technologies to track activity on our application and hold certain information, such as your shopping cart contents and login session.</p>

          <h2 style={sectionTitleStyle}>5. Data Security</h2>
          <p style={textStyle}>We implement standard security measures to maintain the safety of your personal information. Passwords are securely hashed, and all payment processing is handled through encrypted gateways.</p>

          <h2 style={sectionTitleStyle}>6. Contact Us</h2>
          <p style={textStyle}>If you have any questions about this Privacy Policy, please contact us at support@goatindia.com.</p>
          
          <div style={{ marginTop: '40px', borderTop: '2px dashed #000', paddingTop: '20px', textAlign: 'center' }}>
            <span style={{ fontWeight: '900', fontSize: '12px', letterSpacing: '2px' }}>[ GOAT INDIA // CLASSIFIED ]</span>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicyScreen;