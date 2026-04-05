import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product, darkTheme = false }) => {
  const reviewCount = product.reviews ? product.reviews.length : 0;
  const averageRating = reviewCount > 0 
    ? (product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviewCount).toFixed(1)
    : 0;

  const isOutOfStock = product.countInStock === 0;
  const isPremium = parseFloat(product.price) >= 2500;

  // Discount Logic
  const original = parseFloat(product.originalPrice);
  const selling = parseFloat(product.price);
  const discountPercent = (original > selling) 
    ? Math.round(((original - selling) / original) * 100) 
    : 0;

  // --- THEME DEFINITIONS ---
  const bgColor = darkTheme ? '#111' : '#fff'; 
  const textColor = darkTheme ? '#fff' : '#000';
  const borderColor = darkTheme ? '#222' : '#eee';
  const btnBg = darkTheme ? '#fff' : '#000'; 
  const btnText = darkTheme ? '#000' : '#fff';
  const subText = darkTheme ? '#666' : '#aaa';

  const cardStyle = {
    background: bgColor,
    border: `1px solid ${borderColor}`,
    padding: '15px',
    marginBottom: '20px',
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    opacity: isOutOfStock ? 0.6 : 1,
    transition: 'all 0.3s ease',
    textAlign: 'left',
    borderRadius: '0px',
    color: textColor // Force text color inheritance
  };

  return (
    <div style={cardStyle} className={`${!isOutOfStock ? "product-card-hover" : ""} ${darkTheme ? "dark-theme-card" : ""}`.trim()}>
      {/* 1. DISCOUNT BADGE */}
      {discountPercent > 0 && !isOutOfStock && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px', backgroundColor: '#ff0000',
          color: '#fff', padding: '4px 8px', fontSize: '10px', fontWeight: '900', zIndex: 15
        }}>{discountPercent}% OFF</div>
      )}

      {/* 2. IMAGE SECTION */}
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
        <div style={{ 
          width: '100%', aspectRatio: '1/1', overflow: 'hidden', 
          backgroundColor: darkTheme ? '#000' : '#f9f9f9', // Kill the white leak
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <img 
            src={product.image} 
            alt={product.name} 
            className={isOutOfStock ? 'grayscale-img' : ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          {isOutOfStock && (
            <div style={{ 
              position: 'absolute', backgroundColor: 'rgba(255,255,255,0.9)', 
              color: '#000', padding: '8px 15px', fontWeight: '900', border: '2px solid #000', fontSize: '11px', zIndex: 10 
            }}>SOLD OUT</div>
          )}
          {isPremium && !isOutOfStock && (
            <div style={{ 
              position: 'absolute', bottom: '10px', left: '10px', 
              backgroundColor: btnBg, color: btnText, 
              padding: '3px 10px', fontSize: '9px', fontWeight: '900', zIndex: 5 
            }}>PREMIUM DROP</div>
          )}
        </div>
      </Link>

      {/* 3. INFO SECTION */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginTop: '15px' }}>
        <div style={{ fontSize: '10px', color: subText, fontWeight: '900', letterSpacing: '1px' }}>
          {product.category?.toUpperCase() || 'COLLECTION'}
        </div>

        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', color: textColor, margin: '5px 0' }}>
            {product.name}
          </div>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ backgroundColor: textColor, color: bgColor, padding: '3px 8px', fontWeight: '900', fontSize: '10px', marginRight: '10px' }}>
            {averageRating > 0 ? `★ ${averageRating}` : 'NEW'}
          </span>
          <span style={{ fontSize: '10px', color: subText, fontWeight: '800' }}>{reviewCount} REVIEWS</span>
        </div>

        <div style={{ marginBottom: '15px' }}>
          {discountPercent > 0 && !isOutOfStock && (
            <span style={{ fontSize: '13px', color: subText, textDecoration: 'line-through', marginRight: '10px' }}>
              ₹{product.originalPrice}
            </span>
          )}
          <span style={{ fontSize: '18px', fontWeight: '900', color: textColor }}>₹{product.price}</span>
        </div>

        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <button style={{ 
            backgroundColor: btnBg, 
            color: btnText, 
            border: 'none', 
            padding: '12px', width: '100%', fontWeight: '800', textTransform: 'uppercase', 
            cursor: isOutOfStock ? 'not-allowed' : 'pointer', marginTop: 'auto'
          }} disabled={isOutOfStock}>
            {isOutOfStock ? 'OUT OF ARCHIVE' : 'View Piece'}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Product;