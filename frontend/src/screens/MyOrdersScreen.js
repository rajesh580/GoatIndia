import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(`/api/orders/myorders`, config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, userInfo]);

  // --- INLINE STYLE OBJECTS ---
  const titleStyle = {
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '-1.5px',
    marginBottom: '30px',
    borderBottom: '5px solid #000',
    display: 'inline-block'
  };

  const tableHeaderStyle = {
    backgroundColor: '#000',
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: '12px',
    letterSpacing: '2px',
    padding: '15px'
  };

  const detailsBtnStyle = {
    backgroundColor: 'transparent',
    color: '#000',
    border: '2px solid #000',
    borderRadius: '0px',
    fontWeight: '800',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    padding: '5px 15px',
    transition: '0.3s'
  };

  const blueprintStyle = {
    backgroundColor: '#f9f9f9',
    backgroundImage: 'linear-gradient(to right, #e8e8e8 1px, transparent 1px), linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    minHeight: '100vh'
  };

  return (
    <div style={blueprintStyle}>
      <Container className="py-5" style={{ minHeight: '80vh' }}>
      <style>
        {`
          .order-row {
            transition: all 0.2s ease;
            background-color: #fff !important;
          }
          .order-row:hover {
            background-color: #f9f9f9 !important;
            transform: scale(1.005);
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          }
          .details-btn:hover {
            background-color: #000 !important;
            color: #fff !important;
          }
          .status-badge {
            font-size: 10px;
            padding: 4px 8px;
            text-transform: uppercase;
            font-weight: 900;
            letter-spacing: 1px;
            border: 1px solid #000;
          }
        `}
      </style>

      <h2 style={titleStyle}>Order History</h2>

      {loading ? (
        <div className="py-5">
          <style>{`@keyframes pulse { 0% { opacity: 0.6; } 100% { opacity: 1; } } .brutalist-skeleton { background: #e0e0e0; border: 2px solid #000; animation: pulse 1s infinite alternate; }`}</style>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="brutalist-skeleton mb-3" style={{ height: '60px', width: '100%' }}></div>
          ))}
        </div>
      ) : error ? (
        <Alert variant="danger" style={{ borderRadius: '0', fontWeight: '700' }}>{error}</Alert>
      ) : orders.length === 0 ? (
        <div style={{ padding: '80px 20px', border: '4px dashed #000', textAlign: 'center', backgroundColor: '#fff' }}>
          <h4 style={{ fontWeight: '900', fontSize: '1.8rem', letterSpacing: '-1px', textTransform: 'uppercase' }}>[ NULL EXCEPTION: NO TRANSACTIONS LOGGED <span className="terminal-cursor">█</span> ]</h4>
          <Button variant="dark" className="mt-4 px-5 py-3" onClick={() => navigate('/')} style={{ borderRadius: '0', fontWeight: '900', letterSpacing: '2px' }}>
            OPEN ARCHIVE
          </Button>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>
          <Table responsive className="mb-0">
            <thead>
              <tr>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>PURCHASE DATE</th>
                <th style={tableHeaderStyle}>TOTAL</th>
                <th style={tableHeaderStyle}>COLLECTION ITEMS</th>
                <th style={tableHeaderStyle}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const itemsList = JSON.parse(order.items);
                return (
                  <tr key={order.id} className="order-row">
                    <td style={{ verticalAlign: 'middle', fontWeight: '700', fontSize: '13px' }}>
                      #{order.id.toString().padStart(4, '0')}
                    </td>
                    <td style={{ verticalAlign: 'middle', color: '#555', fontSize: '14px' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td style={{ verticalAlign: 'middle', fontWeight: '900', fontSize: '15px' }}>
                      ₹{order.totalPrice.toFixed(2)}
                    </td>
                    <td style={{ verticalAlign: 'middle', color: '#777', fontSize: '13px', maxWidth: '300px' }}>
                      <span className="text-truncate d-block">
                        {itemsList.map(item => item.name.toUpperCase()).join(', ')}
                      </span>
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <Button 
                        style={detailsBtnStyle}
                        className="details-btn"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        View Info
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
      </Container>
    </div>
  );
};

export default MyOrdersScreen;