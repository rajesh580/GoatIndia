import React from 'react';

const ProductSkeleton = () => {
  return (
    <div style={{ padding: '15px', border: '1px solid #eee', marginBottom: '20px', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      <style>
        {`
          @keyframes skeletonPulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
          .skeleton-box {
            animation: skeletonPulse 1.5s ease-in-out infinite;
            background-color: #e0e0e0;
          }
        `}
      </style>
      <div className="skeleton-box" style={{ width: '100%', aspectRatio: '1/1' }}></div>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginTop: '15px' }}>
        <div className="skeleton-box" style={{ height: '10px', width: '40%', marginBottom: '10px' }}></div>
        <div className="skeleton-box" style={{ height: '14px', width: '80%', marginBottom: '10px' }}></div>
        <div className="skeleton-box" style={{ height: '18px', width: '30%', marginBottom: '15px' }}></div>
        <div className="skeleton-box" style={{ height: '40px', width: '100%', marginTop: 'auto' }}></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;