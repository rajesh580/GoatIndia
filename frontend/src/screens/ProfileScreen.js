import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileScreen = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      const fetchMyOrders = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get(`/api/orders/myorders?email=${encodeURIComponent(userInfo.email)}`, config);
          setOrders(data);
        } catch (error) {
          console.error("Error fetching orders", error);
        }
      };
      fetchMyOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, userInfo?.token]);

  // --- INLINE STYLE OBJECTS ---
  const sectionTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: '4px solid #000',
    display: 'inline-block',
    marginBottom: '30px'
  };

  const profileBoxStyle = {
    border: '2px solid #000',
    padding: '30px',
    backgroundColor: '#fff',
    marginBottom: '30px'
  };

  const tableHeaderStyle = {
    backgroundColor: '#000',
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: '12px',
    letterSpacing: '2px',
    border: 'none'
  };

  return (
    <Container className="py-5">
      <style>
        {`
          .order-table-row {
            transition: 0.3s;
            cursor: pointer;
          }
          .order-table-row:hover {
            background-color: #f9f9f9 !important;
          }
          .btn-details {
            border-radius: 0;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
            padding: 5px 15px;
            transition: 0.3s;
            border: 2px solid #000;
          }
          .btn-details:hover {
            background-color: #000;
            color: #fff;
          }
          .status-indicator {
            font-weight: 900;
            font-size: 12px;
            text-transform: uppercase;
          }
        `}
      </style>

      <Row>
        {/* User Information Sidebar */}
        <Col md={4} lg={3}>
          <h2 style={sectionTitleStyle}>Member Profile</h2>
          <div style={profileBoxStyle}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#aaa', letterSpacing: '2px' }}>NAME</label>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>{userInfo?.name?.toUpperCase()}</div>
            </div>
            <div>
              <label style={{ fontSize: '10px', fontWeight: '900', color: '#aaa', letterSpacing: '2px' }}>EMAIL ID</label>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#555' }}>{userInfo?.email}</div>
            </div>
            <Button 
              variant="outline-dark" 
              className="mt-4 w-100" 
              style={{ borderRadius: 0, fontWeight: '800', fontSize: '12px' }}
              onClick={() => navigate('/settings')}
            >
              EDIT ACCOUNT
            </Button>
          </div>
        </Col>

        {/* Order History Main Area */}
        <Col md={8} lg={9}>
          <h2 style={sectionTitleStyle}>Order History</h2>
          <div style={{ border: '1px solid #eee', backgroundColor: '#fff' }}>
            <Table responsive className='mb-0'>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>ID</th>
                  <th style={tableHeaderStyle}>DATE</th>
                  <th style={tableHeaderStyle}>TOTAL</th>
                  <th style={tableHeaderStyle}>PAID</th>
                  <th style={tableHeaderStyle}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">No transactions found in your history.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="order-table-row">
                      <td style={{ verticalAlign: 'middle', fontWeight: '700' }}>#{order.id.toString().padStart(4, '0')}</td>
                      <td style={{ verticalAlign: 'middle' }}>{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                      <td style={{ verticalAlign: 'middle', fontWeight: '800' }}>₹{order.totalPrice.toFixed(2)}</td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <span className="status-indicator" style={{ color: order.isPaid ? '#28a745' : '#ff4444' }}>
                          {order.isPaid ? '✓ Verified' : '⨯ Pending'}
                        </span>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <Button 
                          variant='light' 
                          className='btn-details' 
                          onClick={() => navigate(`/order/${order.id}`)}
                        >
                          Invoice
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;