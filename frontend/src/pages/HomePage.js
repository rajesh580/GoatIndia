import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../components/Product';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      // Ensure this points to your backend port
      const { data } = await axios.get(`/api/products`);
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  // --- STYLES ---
  const headerStyle = {
    fontSize: '2.5rem',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '-1px',
    marginBottom: '40px',
    borderBottom: '5px solid #000',
    display: 'inline-block',
    paddingBottom: '10px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '40px'
  };

  return (
    <div style={{ padding: '40px 5%' }}>
      <h1 style={headerStyle}>Latest Drops</h1>
      
      {/* Using CSS Grid instead of Bootstrap Rows 
          allows for more control over the spacing 
          and alignment of your product cards.
      */}
      <div style={gridStyle}>
        {products.map((product) => (
          <div key={product.id}>
            <Product product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;