import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Retrieve user info from localStorage
  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    setIsMobileOpen(false);
  };

  // Dynamic Command Center Search Trigger
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const { data } = await axios.get(`/api/products?keyword=${searchQuery}&limit=8`);
        setSearchResults(data.products || []);
      } catch (error) {
        console.error('Error fetching search results', error);
      }
      setSearchLoading(false);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // --- STYLES ---
  const navBarStyle = {
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '25px 0',
    borderBottom: '1px solid #333',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 9999,
    width: '100%',
    boxSizing: 'border-box'
  };

  const brandStyle = {
    color: '#fff',
    fontSize: '26px',
    fontWeight: '900',
    letterSpacing: '6px',
    textTransform: 'uppercase',
    border: '3px solid #fff',
    padding: '10px 30px',
    textDecoration: 'none',
    transition: '0.3s ease',
    marginBottom: '20px'
  };

  const linkStyle = (id) => ({
    color: isHovered === id ? '#ffcc00' : '#ffffff',
    fontWeight: '700',
    fontSize: '13px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    padding: '10px 15px',
    textDecoration: 'none',
    transition: '0.2s ease-in-out',
    cursor: 'pointer',
    transform: isHovered === id ? 'translateY(-2px)' : 'translateY(0)',
    display: 'inline-block'
  });

  const userBoxStyle = {
    border: '2px solid #ffcc00',
    padding: '8px 18px',
    color: '#ffcc00',
    fontWeight: '900',
    fontSize: '12px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    transition: '0.3s'
  };

  return (
    <>
      <nav className="custom-navbar" style={navBarStyle}>
      <style>
        {`
          .mobile-toggle-btn { display: none; }
          .nav-links-wrapper { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 15px; width: 100%; transition: all 0.3s ease; }
          
          @media (max-width: 768px) {
            .custom-navbar { padding: 15px 20px !important; flex-direction: row !important; justify-content: space-between !important; }
            .brand-logo { margin-bottom: 0 !important; font-size: 18px !important; padding: 6px 15px !important; letter-spacing: 4px !important; }
            
            .mobile-toggle-btn { display: block; background: transparent; border: 2px solid #fff; color: #fff; padding: 6px 12px; cursor: pointer; font-size: 1.2rem; transition: 0.3s; }
            .mobile-toggle-btn:hover { background: #fff; color: #000; }
            
            .nav-links-wrapper { 
              display: none; 
              flex-direction: column; 
              position: absolute; 
              top: 100%; 
              left: 0; 
              background-color: #000; 
              padding: 30px 0; 
              border-bottom: 2px solid #333; 
              gap: 20px !important;
              box-shadow: 0 10px 20px rgba(0,0,0,0.5);
            }
            .nav-links-wrapper.open { display: flex; }
            .nav-links-wrapper > a, .nav-links-wrapper > span { font-size: 16px !important; width: 100%; text-align: center; }
            .auth-section { flex-direction: column; width: 100%; gap: 15px !important; margin-left: 0 !important; margin-top: 10px; }
            .auth-section > a, .auth-section > span { display: flex; justify-content: center; width: 100%; }
            
            .search-overlay { padding: 40px 5% !important; }
            .search-overlay input { font-size: 1.2rem !important; padding: 15px 15px 15px 35px !important; }
            .search-overlay .fa-search { font-size: 1rem !important; }
          }
        `}
      </style>

      {/* BRAND LOGO */}
      <Link 
        to="/" 
        className="brand-logo"
        style={brandStyle}
        onClick={() => setIsMobileOpen(false)}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ffcc00';
          e.currentTarget.style.borderColor = '#ffcc00';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderColor = '#fff';
        }}
      >
        GOAT INDIA
      </Link>

      {/* MOBILE TOGGLE BUTTON */}
      <button className="mobile-toggle-btn" onClick={() => setIsMobileOpen(!isMobileOpen)}>
        <i className={isMobileOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </button>

      {/* NAVIGATION LINKS */}
      <div className={`nav-links-wrapper ${isMobileOpen ? 'open' : ''}`}>
        <Link to="/" style={linkStyle('shop')} onClick={() => setIsMobileOpen(false)} onMouseEnter={() => setIsHovered('shop')} onMouseLeave={() => setIsHovered(null)}>
          Shop
        </Link>
        
        <Link to="/about" style={linkStyle('about')} onClick={() => setIsMobileOpen(false)} onMouseEnter={() => setIsHovered('about')} onMouseLeave={() => setIsHovered(null)}>
          About Us
        </Link>
        
        <Link to="/our-story" style={linkStyle('story')} onClick={() => setIsMobileOpen(false)} onMouseEnter={() => setIsHovered('story')} onMouseLeave={() => setIsHovered(null)}>
          Our Story
        </Link>

        <span style={linkStyle('search')} onClick={() => { setShowSearch(true); setIsMobileOpen(false); }} onMouseEnter={() => setIsHovered('search')} onMouseLeave={() => setIsHovered(null)}>
          Search 🔍
        </span>
        
        <Link to="/cart" style={{ ...linkStyle('cart'), color: isHovered === 'cart' ? '#ffcc00' : '#fff' }} onClick={() => setIsMobileOpen(false)} onMouseEnter={() => setIsHovered('cart')} onMouseLeave={() => setIsHovered(null)}>
          Cart 🛒
        </Link>
        
        <Link to="/contact" style={linkStyle('contact')} onClick={() => setIsMobileOpen(false)} onMouseEnter={() => setIsHovered('contact')} onMouseLeave={() => setIsHovered(null)}>
          Contact
        </Link>

        {/* AUTH SECTION */}
        {userInfo ? (
          <div className="auth-section" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '10px' }}>
            {userInfo.isAdmin && (
              <Link to="/admin/products" style={linkStyle('admin')} onClick={() => setIsMobileOpen(false)} onMouseEnter={() => setIsHovered('admin')} onMouseLeave={() => setIsHovered(null)}>
                Admin
              </Link>
            )}

            <Link to="/profile" style={{ textDecoration: 'none' }} onClick={() => setIsMobileOpen(false)}>
              <div 
                style={userBoxStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 204, 0, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <i className="fas fa-user"></i> {userInfo.name}
              </div>
            </Link>

            <span 
              onClick={logoutHandler} 
              style={{ ...linkStyle('logout'), color: '#ff4444', fontSize: '11px' }}
              onMouseEnter={() => setIsHovered('logout')}
              onMouseLeave={() => setIsHovered(null)}
            >
              Logout
            </span>
          </div>
        ) : (
          <Link 
            to="/login" 
            style={{ ...linkStyle('login'), border: '2px solid #fff', padding: '8px 20px', marginLeft: '10px' }} 
            onClick={() => setIsMobileOpen(false)}
            onMouseEnter={() => setIsHovered('login')}
            onMouseLeave={() => setIsHovered(null)}
          >
            Login
          </Link>
        )}
      </div>
      </nav>

      {/* GLOBAL SEARCH COMMAND CENTER OVERLAY */}
      {showSearch && (
        <div className="search-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(255,255,255,0.98)', zIndex: 10000, color: '#000',
          display: 'flex', flexDirection: 'column', padding: '80px 10%'
        }}>
          <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} style={{
            position: 'absolute', top: '30px', right: '50px', background: 'none', border: 'none',
            color: '#000', fontSize: '40px', cursor: 'pointer', fontWeight: '100', transition: '0.3s'
          }} onMouseEnter={(e) => e.target.style.color = '#ffcc00'} onMouseLeave={(e) => e.target.style.color = '#000'}>×</button>
          
          <div style={{ position: 'relative', margin: '20px auto 60px auto', width: '100%', maxWidth: '800px' }}>
            <span style={{ 
              position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', 
              fontSize: '1.5rem', color: '#888', fontWeight: '400' 
            }}>
              <i className="fas fa-search"></i>
            </span>
            <input 
              type="text" 
              placeholder="SEARCH ARCHIVE..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid #ccc',
                color: '#000', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: '300',
                outline: 'none', textTransform: 'uppercase', padding: '15px 15px 15px 40px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => { e.target.style.borderBottomColor = '#000'; }}
              onBlur={(e) => { e.target.style.borderBottomColor = '#ccc'; }}
              autoFocus
            />
          </div>

          <div className="hide-scrollbar" style={{ overflowY: 'auto', flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' }}>
            {searchLoading ? (
              <h3 style={{ fontWeight: '900', letterSpacing: '2px', color: '#000' }}>SCANNING DATABASE...</h3>
            ) : searchResults.length > 0 ? (
              searchResults.map(product => (
                <div key={product.id} onClick={() => { setShowSearch(false); setSearchQuery(''); navigate(`/product/${product.id}`); }} style={{ cursor: 'pointer', transition: '0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', border: '2px solid #eee' }} />
                  <div style={{ marginTop: '15px', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.name}</div>
                  <div style={{ color: '#555', fontWeight: '700', fontSize: '13px' }}>₹{product.price}</div>
                </div>
              ))
            ) : searchQuery.trim() ? (
              <h3 style={{ fontWeight: '900', letterSpacing: '2px', color: '#888' }}>NO MATCHES FOUND IN ARCHIVE.</h3>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;