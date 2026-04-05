import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Product from '../components/Product';
import ProductSkeleton from '../components/ProductSkeleton';

const CategoryScreen = () => {
  const { categoryName } = useParams(); 
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // FIX: Safety check for the title
  const displayTitle = categoryName ? categoryName.toUpperCase() : "COLLECTION";

  const blueprintStyle = {
    backgroundColor: '#f9f9f9',
    backgroundImage: 'linear-gradient(to right, #e8e8e8 1px, transparent 1px), linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    minHeight: '100vh'
  };

  useEffect(() => {
    setPage(1);
  }, [categoryName, sortOrder]);

  useEffect(() => {
    // If there is no category name in the URL, don't even try to fetch
    if (!categoryName) {
        setLoading(false);
        return;
    }

    const fetchProducts = async () => {
      try {
        if (page === 1) setLoading(true); else setLoadingMore(true);

        const dbMap = {
          tshirts: 'T-shirt',
          hoodies: 'Hoodie',
          sweatshirts: 'Sweatshirt',
          croptops: 'Croptop'
        };

        // Use the map to get the correct DB string
        const dbCategory = dbMap[categoryName] || categoryName;

        const { data } = await axios.get(`/api/products?category=${dbCategory}&page=${page}&limit=8`);
        
        let fetchedProducts = [...data.products];
        if (sortOrder === 'lowToHigh') fetchedProducts.sort((a, b) => a.price - b.price);
        else if (sortOrder === 'highToLow') fetchedProducts.sort((a, b) => b.price - a.price);
        
        if (page === 1) {
          setProducts(fetchedProducts);
        } else {
          setProducts(prev => [...prev, ...fetchedProducts]);
        }
        setPages(data.pages);
        setLoading(false);
        setLoadingMore(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchProducts();
  }, [categoryName, sortOrder, page]);

  return (
    <div style={blueprintStyle}>
      <style>
        {`
          @keyframes terminalBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
          .terminal-cursor { animation: terminalBlink 1s step-end infinite; color: #ff0000; display: inline-block; }
          .blueprint-grid-item { border: 1px solid #d0d0d0; padding: 20px; position: relative; background: #f9f9f9; }
          .blueprint-corner { position: absolute; width: 10px; height: 10px; }
          .blueprint-tl { top: 0; left: 0; border-top: 2px solid #000; border-left: 2px solid #000; }
          .blueprint-tr { top: 0; right: 0; border-top: 2px solid #000; border-right: 2px solid #000; }
          .blueprint-bl { bottom: 0; left: 0; border-bottom: 2px solid #000; border-left: 2px solid #000; }
          .blueprint-br { bottom: 0; right: 0; border-bottom: 2px solid #000; border-right: 2px solid #000; }
        `}
      </style>
      <Container className="py-5">
      <Row className="align-items-center mb-5">
        <Col>
          <h1 style={{ fontWeight: '900', borderBottom: '8px solid #000', display: 'inline-block' }}>
            {displayTitle}
          </h1>
        </Col>
        <Col md={3}>
          <Form.Select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ borderRadius: 0, border: '2px solid #000', fontWeight: '700' }}
          >
            <option value="latest">Latest Arrivals</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <Row>
          {[...Array(8)].map((_, i) => (
            <Col key={i} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <ProductSkeleton />
            </Col>
          ))}
        </Row>
      ) : (
        <>
          <Row>
            {products.length === 0 ? (
              <Col className="text-center mt-5"><h3>NO {displayTitle} FOUND.</h3></Col>
            ) : (
              products.map((item) => (
                <Col key={item.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                  <Product product={item} />
                </Col>
              ))
            )}
          </Row>
          
          {page < pages && (
            <div className="text-center mt-5">
              <Button variant="dark" style={{ borderRadius: 0, padding: '15px 40px', fontWeight: '900', letterSpacing: '2px' }} onClick={() => setPage(page + 1)} disabled={loadingMore}>
                {loadingMore ? 'LOADING...' : 'LOAD MORE ARCHIVE'}
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
    </div>
  );
};

export default CategoryScreen;