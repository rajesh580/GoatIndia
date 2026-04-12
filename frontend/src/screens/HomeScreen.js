import React, { useState, useEffect } from 'react';
import { Carousel, Card, Row, Col, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Product from '../components/Product';
import ProductSkeleton from '../components/ProductSkeleton';

const ScrollHUD = () => {
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    const handler = () => {
      const total = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScroll(Math.round((total / windowHeight) * 100) || 0);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <div className="mobile-hide" style={{ position: 'fixed', top: '90px', right: '20px', zIndex: 9999, backgroundColor: '#000', color: '#ff0000', padding: '5px 10px', fontWeight: '900', fontSize: '10px', letterSpacing: '2px', border: '2px solid #ff0000', pointerEvents: 'none' }}>
      [SYS.SCRL: {scroll}%]
    </div>
  );
};

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [premiumProducts, setPremiumProducts] = useState([]);
  const [premiumTier2Products, setPremiumTier2Products] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const categories = [
    { title: 'T-SHIRTS', path: '/collection/tshirts', img: '/images/Tshirt.avif' },
    { title: 'HOODIES', path: '/collection/hoodies', img: '/images/Hoodie.avif' },
    { title: 'SWEATSHIRTS', path: '/collection/sweatshirts', img: '/images/Sweatshirt.avif' },
    { title: 'CROP TOPS', path: '/collection/croptops', img: '/images/Croptop.avif' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products?limit=50`);
        const productData = data.products;
        
        // Latest Arrivals logic: Sort by ID descending and take top 30
        const latest30 = [...productData].sort((a, b) => b.id - a.id).slice(0, 30);
        setProducts(latest30);

        // Filter Premium Collection (Price >= 2500)
        const premium = productData.filter(p => parseFloat(p.price) >= 2500);
        setPremiumProducts(premium);

        // Filter Tier 2 Collection (Price >= 1500 and < 2500)
        const premiumTier2 = productData.filter(p => parseFloat(p.price) >= 1500 && parseFloat(p.price) < 2500);
        setPremiumTier2Products(premiumTier2);

        // Fetch Recommended Drops
        const { data: recData } = await axios.get(`/api/products/recommended`);
        setRecommended(recData);

        // Fetch Dynamic Slides
        const { data: slideData } = await axios.get(`/api/heroslides`);
        setSlides(slideData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching home data:", err);
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Split Top 30 into two rows for the horizontal scroll
  const row1 = products.slice(0, 15);
  const row2 = products.slice(15, 30);

  const scrollContainerStyle = {
    display: 'flex',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    gap: '25px',
    padding: '20px 0',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  };

  const productWrapperStyle = {
    flex: '0 0 300px',
    display: 'inline-block',
    verticalAlign: 'top'
  };

  const blueprintStyle = {
    backgroundColor: '#f9f9f9',
    backgroundImage: 'linear-gradient(to right, #e8e8e8 1px, transparent 1px), linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    minHeight: '100vh'
  };

  // --- BRUTALIST LOADING & ERROR STATES ---
  if (loading) {
    return (
      <div style={blueprintStyle}>
        <style>
          {`
            @keyframes terminalBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            .terminal-cursor { animation: terminalBlink 1s step-end infinite; color: #ff0000; display: inline-block; }
          `}
        </style>
        <Container fluid style={{ padding: '80px 4%' }}>
          <h2 className="section-header">Initializing Archive <span className="terminal-cursor">█</span></h2>
          <Row>
            {[...Array(8)].map((_, i) => (
              <Col key={i} xs={12} sm={6} md={3} className="mb-4">
                <ProductSkeleton />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
        <h1 style={{ fontWeight: '900', letterSpacing: '5px', textTransform: 'uppercase', color: '#ff0000' }}>SYSTEM DEGRADED</h1>
        <p style={{ fontWeight: '700', letterSpacing: '2px' }}>UNABLE TO FETCH MANIFEST. RETRY LATER.</p>
      </div>
    );
  }

  return (
    <div style={blueprintStyle}>
      <ScrollHUD />
      <style>
        {`
          @keyframes terminalBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
          .terminal-cursor { animation: terminalBlink 1s step-end infinite; color: #ff0000; display: inline-block; }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .marquee-container {
        display: flex; overflow: hidden; white-space: nowrap; background: #1a1a1a;
            color: #fff; padding: 12px 0; font-weight: 900; letter-spacing: 2px; font-size: 11px;
          }
          .marquee-content { display: flex; flex-shrink: 0; animation: marquee 25s linear infinite; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .section-header {
            font-weight: 900; letter-spacing: 3px; text-transform: uppercase;
            border-left: 6px solid #000; padding-left: 20px; margin-bottom: 40px;
          }
          .rec-header {
            font-weight: 900; letter-spacing: 3px; text-transform: uppercase;
            border-left: 6px solid #ff0000; padding-left: 20px; margin: 80px 0 40px;
          }
          .category-card:hover img { transform: scale(1.1); opacity: 0.8 !important; }
          
          /* --- MOBILE OPTIMIZATIONS --- */
          @media (max-width: 768px) {
            .carousel-caption { bottom: 20% !important; }
            .carousel-btn { padding: 12px 30px !important; font-size: 12px !important; }
            .category-card { height: 120px !important; border-width: 3px !important; box-shadow: 0 0 0 1px #fff !important; }
            .product-wrapper { flex: 0 0 80vw !important; min-width: 260px !important; }
            .product-wrapper { flex: 0 0 80vw !important; min-width: 260px !important; }
            .section-header, .rec-header { font-size: 1.5rem !important; padding-left: 15px !important; }
            .marquee-container { padding: 8px 0; font-size: 9px; }
            .hero-slide-container { height: 60vh !important; }
            .category-title { font-size: 0.6rem !important; letter-spacing: 0.5px !important; text-align: center; }
          }
        `}
      </style>

      {/* 1. HERO SLIDESHOW */}
      <Carousel fade interval={4000} indicators={false} nextLabel="" prevLabel="">
        {slides.length > 0 ? (
          slides.map((slide) => (
            <Carousel.Item key={slide.id}>
              <Link to={slide.link}>
              <div className="hero-slide-container" style={{ position: 'relative', height: '80vh', background: '#1a1a1a' }}>
                  <img className="d-block w-100" src={slide.image} alt={slide.title} style={{ height: '100%', objectFit: 'cover', opacity: '0.6' }} />
                  <Carousel.Caption style={{ bottom: '35%' }}>
                    <h1 style={{ fontWeight: '900', fontSize: 'clamp(2.5rem, 10vw, 5rem)', textTransform: 'uppercase', letterSpacing: '-2px', lineHeight: '0.9' }}>{slide.title}</h1>
                    <Button variant="outline-light" className="carousel-btn mt-4 px-5 py-3 fw-bold border-3 rounded-0 letter-spacing-2" style={{ borderColor: '#fff' }}>EXPLORE DROP</Button>
                  </Carousel.Caption>
                </div>
              </Link>
            </Carousel.Item>
          ))
        ) : (
        <div style={{ height: '80vh', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <h3>GOAT INDIA | EST 2026</h3>
          </div>
        )}
      </Carousel>

      {/* MARQUEE */}
      <div className="marquee-container">
        <div className="marquee-content">
          FREE SHIPPING OVER ₹1000 &nbsp; • &nbsp; ARCHITECTURAL STREETWEAR &nbsp; • &nbsp; DESIGNED IN BHARAT &nbsp; • &nbsp; 
          FREE SHIPPING OVER ₹1000 &nbsp; • &nbsp; ARCHITECTURAL STREETWEAR &nbsp; • &nbsp; DESIGNED IN BHARAT &nbsp; • &nbsp; 
          FREE SHIPPING OVER ₹1000 &nbsp; • &nbsp; ARCHITECTURAL STREETWEAR &nbsp; • &nbsp; DESIGNED IN BHARAT &nbsp; • &nbsp; 
          FREE SHIPPING OVER ₹1000 &nbsp; • &nbsp; ARCHITECTURAL STREETWEAR &nbsp; • &nbsp; DESIGNED IN BHARAT &nbsp; • &nbsp; 
        </div>
        <div className="marquee-content" aria-hidden="true">
          FREE SHIPPING OVER ₹1000 &nbsp; • &nbsp; ARCHITECTURAL STREETWEAR &nbsp; • &nbsp; DESIGNED IN BHARAT &nbsp; • &nbsp; 
          FREE SHIPPING OVER ₹1000 &nbsp; • &nbsp; ARCHITECTURAL STREETWEAR &nbsp; • &nbsp; DESIGNED IN BHARAT &nbsp; • &nbsp; 
          FREE SHIPPING OVER ₹1000 &nbsp; • &nbsp; ARCHITECTURAL STREETWEAR &nbsp; • &nbsp; DESIGNED IN BHARAT &nbsp; • &nbsp; 
          FREE SHIPPING OVER ₹1000 &nbsp; • &nbsp; ARCHITECTURAL STREETWEAR &nbsp; • &nbsp; DESIGNED IN BHARAT &nbsp; • &nbsp; 
        </div>
      </div>

      <Container fluid style={{ padding: '80px 4%' }}>
        
        {/* 2. CATEGORIES */}
        <h2 className="section-header">Shop Architecture</h2>
        <Row className="mb-5 pb-5 gx-2 gx-md-4">
          {categories.map((cat) => (
            <Col key={cat.title} xs={3} sm={3} md={3} className="mb-4">
              <Link to={cat.path} style={{ textDecoration: 'none' }}>
                <Card className="category-card bg-dark text-white border-0 rounded-0 overflow-hidden shadow-lg" style={{ height: '400px', border: '4px solid #000', boxShadow: '0 0 0 2px #fff' }}>
                  <Card.Img src={cat.img} alt={cat.title} style={{ height: '100%', objectFit: 'cover', opacity: '0.9', transition: '0.8s' }} />
                </Card>
                <div className="category-title" style={{ color: '#000', fontWeight: '900', fontSize: '1.2rem', letterSpacing: '2px', marginTop: '15px', textTransform: 'uppercase' }}>
                  {cat.title}
                </div>
              </Link>
            </Col>
          ))}
        </Row>

        {/* 3. LATEST ARRIVALS (WHITE THEME) */}
        <h2 className="section-header">Latest Arrivals / Top 30 Drops</h2>
        <div className="hide-scrollbar" style={scrollContainerStyle}>
          {row1.map((product) => (
            <div key={product.id} className="product-wrapper" style={productWrapperStyle}>
              {/* No darkTheme prop = Default White */}
              <Product product={product} /> 
            </div>
          ))}
        </div>
        <div className="hide-scrollbar" style={{ ...scrollContainerStyle, marginTop: '10px' }}>
          {row2.map((product) => (
            <div key={product.id} className="product-wrapper" style={productWrapperStyle}>
              <Product product={product} />
            </div>
          ))}
        </div>

        {/* 4. RECOMMENDED DROPS (WHITE THEME) */}
        {recommended.length > 0 && (
          <>
            <h2 className="rec-header">Recommended for You</h2>
            <Row>
              {recommended.map((product) => (
                <Col key={product.id} sm={12} md={6} lg={3} className="mb-4">
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>

      {/* 5. PREMIUM SECTION (DARK THEME) */}
      {premiumProducts.length > 0 && (
        <div className="premium-architecture-container" style={{ backgroundColor: 'transparent', padding: '100px 0' }}>
          <Container fluid style={{ padding: '0 4%' }}>
            <h2 style={{ color: '#1a1a1a', fontWeight: '900', letterSpacing: '3px', borderLeft: '6px solid #fff', paddingLeft: '20px', marginBottom: '40px', textTransform: 'uppercase' }}>
              Premium Architecture / Tier 1
            </h2>
            <div className="hide-scrollbar" style={scrollContainerStyle}>
              {premiumProducts.map((product) => (
                <div key={product.id} className="product-wrapper" style={productWrapperStyle}>
                  <Product product={product} darkTheme={false} />
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}

      {/* 6. TIER 2 SECTION */}
      {premiumTier2Products.length > 0 && (
        <div className="tier2-architecture-container" style={{ backgroundColor: 'transparent', padding: '100px 0' }}>
          <Container fluid style={{ padding: '0 4%' }}>
            <h2 style={{ color: '#000', fontWeight: '900', letterSpacing: '3px', borderLeft: '6px solid #888', paddingLeft: '20px', marginBottom: '40px', textTransform: 'uppercase' }}>
              Premium Architecture / Tier 2
            </h2>
            <div className="hide-scrollbar" style={scrollContainerStyle}>
              {premiumTier2Products.map((product) => (
                <div key={product.id} className="product-wrapper" style={productWrapperStyle}>
                  <Product product={product} darkTheme={false} />
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;