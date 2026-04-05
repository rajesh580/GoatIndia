import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#000',
      color: '#fff',
      padding: '40px 0 20px 0',
      marginTop: 'auto',
      borderTop: '2px solid #fff'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '50px',
          marginBottom: '30px'
        }}>
          {/* Brand Section */}
          <div>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '900',
              letterSpacing: '4px',
              marginBottom: '15px',
              textTransform: 'uppercase'
            }}>
              GOAT INDIA
            </h3>
            <p style={{
              fontSize: '0.9rem',
              lineHeight: '1.6',
              opacity: '0.8',
              marginBottom: '15px'
            }}>
              Architectural Streetwear Designed in Bharat.
              Premium quality garments for the modern individual.
            </p>
            <div style={{
              display: 'flex',
              gap: '15px',
              fontSize: '1.5rem'
            }}>
              <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ textAlign: 'right' }}>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '900',
              letterSpacing: '2px',
              marginBottom: '15px',
              textTransform: 'uppercase'
            }}>
              Quick Links
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              textAlign: 'right'
            }}>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/" style={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Shop
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/about" style={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  About Us
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/our-story" style={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Our Story
                </Link>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <Link to="/contact" style={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid #333',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{
            fontSize: '0.8rem',
            opacity: '0.7',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            © {currentYear} GOAT INDIA. ALL RIGHTS RESERVED.
          </div>
          <div style={{
            display: 'flex',
            gap: '20px',
            fontSize: '0.8rem',
            opacity: '0.7'
          }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>Refund Policy</span>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            footer {
              padding: 30px 0 15px 0 !important;
            }
            footer > div {
              padding: 0 15px !important;
            }
            footer h3 {
              font-size: 1.5rem !important;
              margin-bottom: 10px !important;
            }
            footer h4 {
              font-size: 1rem !important;
              margin-bottom: 10px !important;
            }
            footer .grid-container {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }
            footer .newsletter-input {
              flex-direction: column !important;
            }
            footer .newsletter-input input,
            footer .newsletter-input button {
              width: 100% !important;
            }
            footer .bottom-section {
              flex-direction: column !important;
              text-align: center !important;
              gap: 10px !important;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;