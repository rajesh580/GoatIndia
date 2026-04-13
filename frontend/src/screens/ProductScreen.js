import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Row, Col, Image, Button, Form, Container, ListGroup, Modal, Table, Carousel } from 'react-bootstrap';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

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

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [size, setSize] = useState('M');
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const { addToCart, cartItems } = useContext(CartContext);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Logic Constants
  const isOutOfStock = product.countInStock === 0;

  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviewCount).toFixed(1)
    : 0;

  const original = parseFloat(product.originalPrice);
  const selling = parseFloat(product.price);
  const discountPercent = (original > selling) 
    ? Math.round(((original - selling) / original) * 100) 
    : 0;

  const isInCart = cartItems ? cartItems.some((item) => String(item.id) === String(product.id) && item.size === size) : false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productData } = await axios.get(`/api/products/${id}`);
        setProduct(productData);
        setSelectedImage(productData.image);
        const { data: reviewData } = await axios.get(`/api/products/${id}/reviews`);
        setReviews(reviewData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [id]);

  const addToCartHandler = () => {
    if (!isOutOfStock) {
      addToCart(product, size);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const acquireHandler = () => {
    if (!isOutOfStock) {
      addToCart(product, size);
      if (userInfo) { navigate('/shipping'); } 
      else { navigate('/login?redirect=shipping'); }
    }
  };

  const toastStyle = { borderRadius: 0, border: '3px solid #000', fontWeight: '900', textTransform: 'uppercase', color: '#000', background: '#fff' };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please assign a score.", { style: toastStyle }); return; }
    try {
      await axios.post(`/api/products/${id}/reviews`, {
        rating, comment, userId: userInfo.id, userName: userInfo.name
      });
      toast.success('Review Verified!', { style: toastStyle });
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting verification', { style: toastStyle });
    }
  };

  const labelStyle = { fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa', marginBottom: '15px', display: 'block' };

  const blueprintStyle = {
    backgroundColor: '#f9f9f9',
    backgroundImage: 'linear-gradient(to right, #e8e8e8 1px, transparent 1px), linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    minHeight: '100vh'
  };

  // Foolproof image extractor (handles Arrays, valid JSON, and raw comma-separated strings/URLs)
  let additionalImages = [];
  if (Array.isArray(product.images)) {
    additionalImages = product.images;
  } else if (typeof product.images === 'string' && product.images.trim() !== '') {
    try {
      additionalImages = JSON.parse(product.images);
      if (!Array.isArray(additionalImages)) additionalImages = [additionalImages];
    } catch (e) {
        const urlRegex = /(data:image\/[^;]+;base64,[a-zA-Z0-9+/=]+|https?:\/\/[^"'\s,[\]]+)/g;
      additionalImages = product.images.match(urlRegex) || [];
    }
  }
  const allImages = product.image ? [...new Set([product.image, ...additionalImages])] : [];

  // --- BRUTALIST MICRO-INTERACTIONS ---
  const magneticMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  };
  const magneticLeave = (e) => { e.currentTarget.style.transform = `translate(0px, 0px)`; };

  const shareDrop = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('LINK TRANSMITTED TO CLIPBOARD', { style: toastStyle });
  };

  const handlePrevImage = () => {
    const currentIndex = allImages.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
  };

  const handleNextImage = () => {
    const currentIndex = allImages.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
  };

  return (
    <div style={blueprintStyle}>
      <ScrollHUD />
      <Container className="py-4 py-md-5" style={{ backgroundColor: 'transparent', minHeight: '100vh' }}>
      <Helmet>
        <title>{product.name ? `${product.name} | GOAT INDIA` : 'INITIALIZING... | GOAT INDIA'}</title>
        <meta name="description" content={product.description || "Premium streetwear architecture."} />
        <meta property="og:title" content={product.name ? `${product.name} | GOAT INDIA` : 'GOAT INDIA'} />
        <meta property="og:description" content={product.description || "Premium streetwear architecture."} />
        {product.image && <meta property="og:image" content={product.image.startsWith('http') ? product.image : `https://yourdomain.com${product.image}`} />}
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <style>
        {`
          ::selection { background-color: #ff0000; color: #ffffff; }
          .back-btn { text-decoration: none; color: #000; font-weight: 900; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 30px; display: inline-block; cursor: pointer; background: none; border: none; }
          .review-item { border: 2px solid #000 !important; margin-bottom: 15px !important; padding: 25px !important; border-radius: 0 !important; }
          .product-title { font-size: 3.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -2px; line-height: 0.85; margin-bottom: 20px; color: ${isOutOfStock ? '#aaa' : '#000'}; }
          .discount-tag { position: absolute; top: 20px; left: 20px; background-color: #ff0000; color: #fff; padding: 8px 15px; font-weight: 900; z-index: 10; font-size: 14px; }
          .out-of-stock-label { color: #ff0000; font-weight: 900; font-size: 14px; letter-spacing: 1px; margin-bottom: 20px; display: block; }
          .sticky-details { position: sticky; top: 120px; }
          
          /* Brutalist Enhancements */
          .btn-brutalist { transition: 0.1s; background-color: transparent; color: #000; border: 2px solid #000; }
          .btn-brutalist:hover:not(:disabled) { box-shadow: 6px 6px 0px #000; transform: translate(-2px, -2px); background-color: #000; color: #fff; }
          .btn-brutalist:active:not(:disabled) { box-shadow: 2px 2px 0px #000; transform: translate(0px, 0px); }
          .btn-brutalist-dark { transition: 0.1s; background-color: #000; color: #fff; border: 2px solid #000; }
          .btn-brutalist-dark:hover:not(:disabled) { box-shadow: 6px 6px 0px #000; transform: translate(-2px, -2px); background-color: #fff; color: #000; }
          .btn-brutalist-dark:active:not(:disabled) { box-shadow: 2px 2px 0px #000; transform: translate(0px, 0px); }
          
          .mobile-sticky-cart { display: none; }

          @media (max-width: 768px) { 
            .sticky-details { position: static; } 
            .product-title { font-size: 2.2rem; } 
            .mobile-sticky-cart { display: flex; position: fixed; bottom: 0; left: 0; width: 100%; background: #fff; border-top: 4px solid #000; padding: 15px; z-index: 999; gap: 10px; }
            .mobile-hide { display: none !important; }
            .mobile-gallery { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; -ms-overflow-style: none; scrollbar-width: none; }
            .mobile-gallery::-webkit-scrollbar { display: none; }
            .mobile-gallery-item { flex: 0 0 100%; scroll-snap-align: center; }
          }
          .carousel-indicators [data-bs-target] { background-color: #000; width: 8px; height: 8px; border-radius: 50%; border: 1px solid #fff; }
          .carousel-control-prev-icon, .carousel-control-next-icon { filter: invert(1); }
          @keyframes pulseBadge { 0% { box-shadow: 0 0 0 0 rgba(0,0,0, 0.5); } 70% { box-shadow: 0 0 0 8px rgba(0,0,0, 0); } 100% { box-shadow: 0 0 0 0 rgba(0,0,0, 0); } }
        `}
      </style>

      <div style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', color: '#888' }}>
        <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>HOME</Link> /{' '}
        <Link to={`/collection/${product.category?.toLowerCase()}`} style={{ color: '#888', textDecoration: 'none' }}>{product.category}</Link> /{' '}
        <span style={{ color: '#000' }}>{product.name}</span>
      </div>

      <button onClick={() => navigate(-1)} className="back-btn">← Back to Drop</button>

      <Row>
        <Col lg={7} md={6} className="mb-5 d-flex flex-column flex-md-row gap-3">
          {/* Thumbnails (Desktop) */}
          <div className="mobile-hide d-flex flex-md-column gap-2" style={{ width: '80px', overflowY: 'auto', maxHeight: '650px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {allImages.map((img, idx) => (
              <Image 
                key={idx} 
                src={img} 
                alt={`${product.name} ${idx}`} 
                style={{ width: '80px', height: '80px', objectFit: 'cover', border: selectedImage === img ? '2px solid #000' : '1px solid #ddd', cursor: 'pointer', transition: '0.2s' }}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
          
          <div className="flex-grow-1">
            {/* Desktop Main Image */}
            <div className="mobile-hide" style={{ overflow: 'hidden', backgroundColor: '#f9f9f9', border: '1px solid #eee', position: 'relative' }}>
              {discountPercent > 0 && !isOutOfStock && <div className="discount-tag">{discountPercent}% OFF</div>}
              <div style={{ width: '100%', height: '650px', backgroundImage: selectedImage ? `url(${selectedImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', filter: isOutOfStock ? 'grayscale(100%)' : 'none' }} />
              
              {allImages.length > 1 && (
                <>
                  <Button 
                    variant="light" 
                    onClick={handlePrevImage} 
                    style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', borderRadius: '0', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #000', fontWeight: '900', fontSize: '20px', padding: 0, transition: '0.2s', boxShadow: '4px 4px 0px #000', color: '#000', zIndex: 10 }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-50%) translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px #000'; e.currentTarget.style.backgroundColor = '#000'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(-50%)'; e.currentTarget.style.boxShadow = '4px 4px 0px #000'; e.currentTarget.style.backgroundColor = '#f8f9fa'; e.currentTarget.style.color = '#000'; }}
                  >
                    ←
                  </Button>
                  <Button 
                    variant="light" 
                    onClick={handleNextImage} 
                    style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', borderRadius: '0', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #000', fontWeight: '900', fontSize: '20px', padding: 0, transition: '0.2s', boxShadow: '4px 4px 0px #000', color: '#000', zIndex: 10 }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-50%) translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px #000'; e.currentTarget.style.backgroundColor = '#000'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(-50%)'; e.currentTarget.style.boxShadow = '4px 4px 0px #000'; e.currentTarget.style.backgroundColor = '#f8f9fa'; e.currentTarget.style.color = '#000'; }}
                  >
                    →
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Swipe Gallery */}
            <div className="d-md-none" style={{ position: 'relative', border: '1px solid #eee' }}>
              {discountPercent > 0 && !isOutOfStock && <div className="discount-tag">{discountPercent}% OFF</div>}
              <Carousel interval={null} indicators={true} controls={allImages.length > 1}>
                {allImages.map((img, idx) => (
                  <Carousel.Item key={idx}>
                    <Image src={img} alt={`${product.name} ${idx}`} fluid className={isOutOfStock ? 'grayscale-img' : ''} style={{ minHeight: '400px', width: '100%', objectFit: 'cover' }} />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>
        </Col>

        <Col lg={5} md={6}>
          <div className="sticky-details">
            <div className="mb-3 d-flex align-items-center">
               <span style={{ backgroundColor: isOutOfStock ? '#ccc' : '#000', color: '#fff', fontWeight: '900', fontSize: '12px', padding: '5px 12px', marginRight: '10px', animation: averageRating >= 4 ? 'pulseBadge 2s infinite' : 'none' }}>
                 {averageRating > 0 ? `★ ${averageRating} GOAT SCORE` : 'UNRATED DROP'}
               </span>
               <span style={{ fontSize: '10px', fontWeight: '800', color: '#888', textTransform: 'uppercase' }}>Based on {reviewCount} Reviews</span>
            </div>

            <h1 className="product-title">{product.name}</h1>
            
            {isOutOfStock && <span className="out-of-stock-label">SOLD OUT / OUT OF ARCHIVE</span>}

            <div className="d-flex align-items-baseline mb-4 mt-2">
                <span style={{ fontSize: '2.5rem', fontWeight: '900', fontFamily: 'monospace', color: isOutOfStock ? '#ccc' : '#000' }}>₹{product.price}</span>
                {discountPercent > 0 && !isOutOfStock && (
                    <span style={{ fontSize: '1.2rem', color: '#aaa', textDecoration: 'line-through', marginLeft: '15px', fontWeight: '600' }}>₹{product.originalPrice}</span>
                )}
            </div>

            <div className="mb-5 mt-4 pt-4 border-top">
              <span style={labelStyle}>Technical Specs</span>
              <p style={{ color: '#555', lineHeight: '1.6', fontSize: '15px', fontWeight: '500' }}>
                {product.description || "Premium heavyweight cotton. Oversized fit architecture. Signature GOAT INDIA branding."}
              </p>
            </div>

            {isOutOfStock && (
              <div style={{ border: '2px dashed #000', padding: '20px', marginTop: '10px', marginBottom: '30px' }}>
                <span style={{ fontWeight: '900', fontSize: '12px', letterSpacing: '2px' }}>[ CLASSIFIED: JOIN WAITLIST ]</span>
                <div className="d-flex mt-3">
                  <input type="email" placeholder="ENTER EMAIL" style={{ border: '2px solid #000', borderRadius: 0, padding: '10px', width: '100%', outline: 'none', fontWeight: '700' }} />
                  <Button className="btn-brutalist-dark" style={{ borderLeft: 'none', whiteSpace: 'nowrap', padding: '10px 20px' }} onClick={() => toast.success('MANIFEST UPDATED', {style: toastStyle})}>NOTIFY ME</Button>
                </div>
              </div>
            )}

            {!isOutOfStock && (
              <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ ...labelStyle, marginBottom: 0 }}>Select Architecture (Size)</span>
                  <span onClick={() => setShowSizeGuide(true)} style={{ fontSize: '10px', fontWeight: '900', textDecoration: 'underline', cursor: 'pointer', textTransform: 'uppercase' }}>Size Guide</span>
                </div>
                <Form.Control as='select' value={size} onChange={(e) => setSize(e.target.value)} style={{ borderRadius: 0, border: '2px solid #000', padding: '15px', fontWeight: '900' }}>
                  <option value='S'>S — SMALL</option>
                  <option value='M'>M — MEDIUM</option>
                  <option value='L'>L — LARGE</option>
                  <option value='XL'>XL — EXTRA LARGE</option>
                </Form.Control>
              </div>
            )}

            <Row className="mb-4 mobile-hide">
              <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                <Button onClick={addToCartHandler} disabled={isOutOfStock || isInCart} className="w-100 btn-brutalist" style={{ borderRadius: 0, padding: '20px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', backgroundColor: added ? '#28a745' : '', color: added ? '#fff' : '', borderColor: added ? '#28a745' : '' }}>
                  {isOutOfStock ? 'SOLD OUT' : (isInCart ? 'ADDED ✓' : (added ? 'ADDED ✓' : 'ADD TO CART'))}
                </Button>
              </Col>
              <Col xs={12} sm={6}>
                <Button onClick={acquireHandler} disabled={isOutOfStock} className="w-100 btn-brutalist-dark" style={{ backgroundColor: isOutOfStock ? '#eee' : '', color: isOutOfStock ? '#aaa' : '', borderColor: isOutOfStock ? '#ccc' : '', borderRadius: 0, padding: '20px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', transition: 'transform 0.1s' }} onMouseMove={magneticMove} onMouseLeave={magneticLeave}>
                  {isOutOfStock ? 'NOT AVAILABLE' : 'ACQUIRE DROP'}
                </Button>
              </Col>
            </Row>
            <Button onClick={shareDrop} className="w-100 mt-2 btn-brutalist" style={{ borderRadius: 0, padding: '15px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', transition: 'transform 0.1s' }} onMouseMove={magneticMove} onMouseLeave={magneticLeave}>
              [ TRANSMIT LINK ]
            </Button>
          </div>
        </Col>
      </Row>

      {/* --- RESTORED REVIEWS SECTION --- */}
      <Row className="mt-5 pt-5 border-top">
        <Col md={6} className="mb-5">
          <h2 style={{ fontWeight: '900', textTransform: 'uppercase', marginBottom: '30px', fontSize: '2rem' }}>Verified Reviews</h2>
          {reviews.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic' }}>No data points yet. Be the first to verify this drop.</p>
          ) : (
            <ListGroup variant='flush'>
              {reviews.map((review) => (
                <ListGroup.Item key={review.id} className="review-item shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <strong style={{ letterSpacing: '1px', fontSize: '14px' }}>{review.userName?.toUpperCase()}</strong>
                    <span style={{ fontSize: '12px', fontWeight: '900', backgroundColor: '#000', color: '#fff', padding: '4px 10px' }}>{review.rating} / 5</span>
                  </div>
                  <p style={{ margin: 0, fontWeight: '500', fontSize: '15px', color: '#333', lineHeight: '1.5' }}>"{review.comment}"</p>
                  <small className="text-muted d-block mt-3" style={{ fontSize: '10px', fontWeight: '700' }}>VERIFIED ON {review.createdAt?.substring(0, 10)}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={6}>
          <div style={{ backgroundColor: '#1a1a1a', padding: '40px', color: '#fff' }}>
            <h4 style={{ fontWeight: '900', textTransform: 'uppercase', marginBottom: '25px', letterSpacing: '2px' }}>Rate this Drop</h4>
            {userInfo ? (
              <Form onSubmit={submitReviewHandler}>
                <Form.Group className="mb-4">
                  <Form.Label style={{ fontSize: '11px', fontWeight: '900', color: '#666' }}>Score</Form.Label>
                  <Form.Select value={rating} onChange={(e) => setRating(e.target.value)} style={{ borderRadius: 0, border: 'none', padding: '12px', fontWeight: '800' }}>
                    <option value='0'>Select Score...</option>
                    <option value='1'>1 — Weak</option>
                    <option value='2'>2 — Average</option>
                    <option value='3'>3 — Solid</option>
                    <option value='4'>4 — Fire</option>
                    <option value='5'>5 — GOAT Status</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontSize: '11px', fontWeight: '900', color: '#666' }}>Commentary</Form.Label>
                  <Form.Control as='textarea' rows={4} value={comment} onChange={(e) => setComment(e.target.value)} style={{ borderRadius: 0, border: 'none', padding: '15px' }} placeholder="Your thoughts on the quality..." />
                </Form.Group>

                <Button type='submit' variant='light' className="w-100 rounded-0 fw-black py-3" style={{ letterSpacing: '2px', fontWeight: '900' }}>SUBMIT VERIFICATION</Button>
              </Form>
            ) : (
              <div className="text-center py-4 border border-secondary">
                <p style={{ fontWeight: '900', margin: 0 }}>PLEASE <Link to='/login' style={{ color: '#fff', textDecoration: 'underline' }}>LOGIN</Link> TO REVIEW</p>
              </div>
            )}
          </div>
        </Col>
      </Row>

      <div className="mobile-sticky-cart">
        <Button onClick={addToCartHandler} disabled={isOutOfStock || isInCart} className="w-50 btn-brutalist" style={{ borderRadius: 0, padding: '15px', fontWeight: '900', fontSize: '12px', letterSpacing: '1px', backgroundColor: added ? '#28a745' : '', color: added ? '#fff' : '', borderColor: added ? '#28a745' : '' }}>
          {isInCart || added ? 'ADDED ✓' : 'ADD TO CART'}
        </Button>
        <Button onClick={acquireHandler} disabled={isOutOfStock} className="w-50 btn-brutalist-dark" style={{ borderRadius: 0, padding: '15px', fontWeight: '900', fontSize: '12px', letterSpacing: '1px', backgroundColor: isOutOfStock ? '#eee' : '', color: isOutOfStock ? '#aaa' : '', borderColor: isOutOfStock ? '#ccc' : '' }}>
          ACQUIRE
        </Button>
      </div>

      {/* SIZE GUIDE MODAL */}
      <Modal show={showSizeGuide} onHide={() => setShowSizeGuide(false)} centered>
        <Modal.Header closeButton style={{ borderRadius: 0, border: '4px solid #000', borderBottom: 'none', backgroundColor: '#fff' }}>
          <Modal.Title style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Architecture Specs</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '0', border: '4px solid #000', borderTop: 'none' }}>
          <Table bordered hover className="mb-0" style={{ textAlign: 'center', fontWeight: '700', fontSize: '14px' }}>
            <thead style={{ backgroundColor: '#000', color: '#fff', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
              <tr>
                <th style={{ backgroundColor: '#000', color: '#fff', border: '1px solid #333' }}>Size</th>
                <th style={{ backgroundColor: '#000', color: '#fff', border: '1px solid #333' }}>Chest (in)</th>
                <th style={{ backgroundColor: '#000', color: '#fff', border: '1px solid #333' }}>Length (in)</th>
                <th style={{ backgroundColor: '#000', color: '#fff', border: '1px solid #333' }}>Shoulder (in)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ border: '1px solid #eee' }}>S</td><td style={{ border: '1px solid #eee' }}>38</td><td style={{ border: '1px solid #eee' }}>27</td><td style={{ border: '1px solid #eee' }}>17.5</td></tr>
              <tr><td style={{ border: '1px solid #eee' }}>M</td><td style={{ border: '1px solid #eee' }}>40</td><td style={{ border: '1px solid #eee' }}>28</td><td style={{ border: '1px solid #eee' }}>18.5</td></tr>
              <tr><td style={{ border: '1px solid #eee' }}>L</td><td style={{ border: '1px solid #eee' }}>42</td><td style={{ border: '1px solid #eee' }}>29</td><td style={{ border: '1px solid #eee' }}>19.5</td></tr>
              <tr><td style={{ border: '1px solid #eee' }}>XL</td><td style={{ border: '1px solid #eee' }}>44</td><td style={{ border: '1px solid #eee' }}>30</td><td style={{ border: '1px solid #eee' }}>20.5</td></tr>
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </Container>
    </div>
  );
};

export default ProductScreen;