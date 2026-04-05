import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Image, Form, Container } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

const CartScreen = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQty } = useContext(CartContext);

  const checkoutHandler = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=shipping');
    }
  };

  const deleteBtnStyle = {
    backgroundColor: '#ff4444',
    color: '#fff',
    border: 'none',
    padding: '8px 15px',
    fontWeight: '900',
    fontSize: '11px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  return (
    <Container style={{ padding: '60px 0', minHeight: '80vh' }}>
      <style>
        {`
          .cart-item-row {
            display: flex; align-items: center; justify-content: space-between;
            width: 100%; padding: 20px; border-bottom: 1px solid #eee;
            background: #fff; margin-bottom: 10px;
          }
          .summary-card-sticky { border: 4px solid #000; padding: 30px; background: #fff; position: sticky; top: 100px; }
          @media (max-width: 768px) {
            .cart-item-row { flex-direction: column; align-items: flex-start; gap: 15px; position: relative; }
            .cart-item-row > div { width: 100% !important; margin: 0 !important; text-align: left !important; }
            .cart-item-img-wrapper { width: 100px !important; }
            .cart-qty-wrapper { max-width: 100px; }
            .cart-delete-wrapper { text-align: left !important; }
            .summary-card-sticky { position: static; margin-top: 30px; }
          }
          @keyframes terminalBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
          .terminal-cursor { animation: terminalBlink 1s step-end infinite; color: #ff0000; display: inline-block; }
        `}
      </style>
      <h1 style={{ fontWeight: '900', textTransform: 'uppercase', borderBottom: '6px solid #000', display: 'inline-block', marginBottom: '40px' }}>
        Your Bag
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        
        {/* LEFT SIDE: ITEMS LIST */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          {cartItems.length === 0 ? (
            <div style={{ padding: '80px 20px', border: '4px dashed #000', textAlign: 'center', backgroundColor: '#fff' }}>
              <h2 style={{fontWeight: '900', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-1.5px', marginBottom: '15px'}}>[ WARN: MANIFEST EMPTY <span className="terminal-cursor">█</span> ]</h2>
              <p style={{ fontWeight: '700', color: '#888', marginBottom: '40px', letterSpacing: '1px' }}>NO ARCHITECTURAL DROPS FOUND IN CURRENT SESSION.</p>
              <Link to="/" style={{ backgroundColor: '#000', color: '#fff', padding: '15px 30px', textDecoration: 'none', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', transition: '0.3s' }}>INITIATE RETRIEVAL</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div className="cart-item-img-wrapper" style={{ width: '80px' }}>
                  <Image src={item.image} alt={item.name} fluid />
                </div>
                
                <div style={{ flex: '1', padding: '0 20px' }}>
                  <div style={{ fontWeight: '900', fontSize: '16px', textTransform: 'uppercase' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#aaa', fontWeight: '800' }}>SIZE: {item.size || 'M'}</div>
                </div>

                <div style={{ fontWeight: '900', width: '80px' }}>₹{item.price}</div>

                <div className="cart-qty-wrapper" style={{ width: '80px', margin: '0 20px' }}>
                  <Form.Control
                    as='select'
                    style={{ border: '2px solid #000', borderRadius: '0', fontWeight: '900' }}
                    value={item.qty}
                    onChange={(e) => updateQty(item.id, Number(e.target.value))}
                  >
                    {[...Array(10).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </Form.Control>
                </div>

                <div className="cart-delete-wrapper" style={{ width: '100px', textAlign: 'right' }}>
                  {/* DELETE OPTION */}
                  <button 
                    style={deleteBtnStyle}
                    onClick={() => removeFromCart(item.id)}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT SIDE: SUMMARY CARD */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div className="summary-card-sticky">
            <h2 style={{ fontWeight: '900', letterSpacing: '-1px' }}>TOTAL</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.8rem', fontWeight: '900', margin: '20px 0' }}>
              <span>₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
            </div>
            <button
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              style={{
                width: '100%',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                padding: '18px',
                fontWeight: '900',
                letterSpacing: '2px',
                cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
                opacity: cartItems.length === 0 ? '0.5' : '1',
                transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out'
              }}
              onMouseMove={(e) => {
                if (cartItems.length > 0) {
                  const btn = e.currentTarget; const rect = btn.getBoundingClientRect();
                  const x = (e.clientX - rect.left - rect.width / 2) * 0.3; const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
                  btn.style.transform = `translate(${x}px, ${y}px)`; btn.style.boxShadow = '6px 6px 0px #aaa';
                }
              }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0px, 0px)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>

      </div>
    </Container>
  );
};

export default CartScreen;