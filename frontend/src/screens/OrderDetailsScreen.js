import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Container, Alert, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import toast from 'react-hot-toast';

const OrderDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // --- MAPPING STATUS INTEGERS TO LABELS ---
  const statusMap = {
    0: { label: 'ORDER PENDING', icon: '📝', color: '#888' },
    1: { label: 'PREPARING FOR DISPATCH', icon: '⚙️', color: '#000' },
    2: { label: 'SHIPPED / IN TRANSIT', icon: '✈️', color: '#000' },
    3: { label: 'OUT FOR DELIVERY', icon: '🛵', color: '#000' },
    4: { label: 'DELIVERED TO DESTINATION', icon: '📦', color: '#28a745' },
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrderDetails();
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate, userInfo?.token]);

  const cancelOrderHandler = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for termination.");
      return;
    }
    try {
      setCancelLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(`/api/orders/${id}/cancel`, { cancelReason }, config);
      setOrder(data);
      setShowCancelModal(false);
      setCancelLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setCancelLoading(false);
    }
  };

  if (loading) return (
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      <style>{`@keyframes pulse { 0% { opacity: 0.6; } 100% { opacity: 1; } } .brutalist-skeleton { background: #e0e0e0; border: 2px solid #000; animation: pulse 1s infinite alternate; }`}</style>
      <div className="brutalist-skeleton mb-4" style={{ height: '40px', width: '30%' }}></div>
      <div className="brutalist-skeleton mb-5" style={{ height: '120px', width: '100%', border: '4px solid #000' }}></div>
      <Row>
        <Col md={8}><div className="brutalist-skeleton" style={{ height: '400px', width: '100%' }}></div></Col>
        <Col md={4}><div className="brutalist-skeleton" style={{ height: '300px', width: '100%', border: '4px solid #000' }}></div></Col>
      </Row>
    </Container>
  );
  if (error) return <Container className="py-5"><Alert variant="danger" style={{borderRadius: 0}}>{error}</Alert></Container>;
  if (!order) return <Container className="py-5"><Alert variant="info" style={{borderRadius: 0}}>Order not found.</Alert></Container>;

  const itemsList = order.items ? JSON.parse(order.items) : [];
  const shipping = order.shippingAddress ? JSON.parse(order.shippingAddress) : {};
  const currentStatus = statusMap[order.status] || statusMap[0];

  // --- INLINE STYLE OBJECTS ---
  const sectionTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: '2px solid #000',
    paddingBottom: '10px',
    marginBottom: '20px'
  };

  const receiptCardStyle = {
    borderRadius: '0',
    border: '3px solid #000',
    padding: '20px',
    backgroundColor: '#fff'
  };

  const blueprintStyle = {
    backgroundColor: '#f9f9f9',
    backgroundImage: 'linear-gradient(to right, #e8e8e8 1px, transparent 1px), linear-gradient(to bottom, #e8e8e8 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    minHeight: '100vh'
  };

  return (
    <div style={blueprintStyle}>
      <Container className="py-5">
      <style>
        {`
          .list-group-item { border: none; padding: 15px 0; }
          .cancel-alert {
            background-color: #000;
            color: #fff;
            border: none;
            border-radius: 0;
            padding: 20px;
            letter-spacing: 1px;
          }
          .modal-content { border-radius: 0; border: 4px solid #000; }
          .modal-header { border-bottom: 2px solid #eee; }
          .btn-cancel {
            background-color: transparent;
            color: #ff4444;
            border: 2px solid #ff4444;
            border-radius: 0;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: 0.3s;
          }
          .btn-cancel:hover { background-color: #ff4444; color: #fff; }
            @keyframes terminalBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            .terminal-cursor { animation: terminalBlink 1s step-end infinite; color: #ff0000; display: inline-block; }
            @media print {
              body { background: #fff !important; }
              body * { visibility: hidden; }
              .receipt-card, .receipt-card * { visibility: visible; }
              .receipt-card { position: absolute; left: 0; top: 0; width: 100%; border: none !important; margin: 0 !important; padding: 0 !important; }
              .print-hide { display: none !important; }
            }
            @media (max-width: 768px) {
              .py-5 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
              h2 { font-size: 1.4rem !important; }
              .tracking-card { padding: 15px !important; margin-bottom: 20px !important; border-width: 2px !important; }
              .tracking-status-text { font-size: 1rem !important; }
              .tracking-step { font-size: 0.9rem !important; }
              .section-title { font-size: 1rem !important; margin-bottom: 10px !important; border-bottom-width: 1px !important; }
              .receipt-card { padding: 15px !important; border-width: 2px !important; margin-top: 20px !important; }
              .receipt-card h2 { font-size: 1.1rem !important; margin-bottom: 15px !important; }
              .receipt-total { font-size: 1.2rem !important; }
              .manifest-name { font-size: 14px !important; }
              .manifest-price { font-size: 14px !important; }
              .btn-cancel { padding: 12px !important; font-size: 14px !important; min-height: 48px !important; }
              .list-group-item { padding: 20px 0 !important; }
              .modal-dialog { margin: 10px !important; max-width: calc(100vw - 20px) !important; }
              .modal-content { border-width: 3px !important; }
              .modal-body { padding: 20px !important; }
              .modal-footer { padding: 0 20px 20px 20px !important; }
              .modal-footer .btn { min-height: 44px !important; font-size: 14px !important; }
              .tracking-progress { flex-direction: column !important; gap: 5px !important; height: 60px !important; }
              .tracking-progress div { height: 8px !important; }
              .cancel-alert { padding: 15px !important; }
              .cancel-alert .fa-2x { font-size: 1.5rem !important; }
              .image-fluid { max-width: 100% !important; height: auto !important; }
            }
        `}
      </style>

      <div className="mb-5">
        <h2 style={{ fontWeight: '900', letterSpacing: '-1.5px', textTransform: 'uppercase' }}>
          Order <span style={{ color: '#888' }}>#{order.id}</span>
        </h2>
        <p className="text-muted">Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* --- MULTI-STAGE SHIPMENT TRACKING BAR --- */}
      {!order.isCancelled && (
        <div className="tracking-card" style={{
          border: '3px solid #000',
          padding: '25px',
          marginBottom: '40px',
          backgroundColor: '#fff'
        }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div className="mb-3 mb-md-0">
              <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', color: '#888', display: 'block' }}>
                SHIPMENT TRACKING
              </span>
              <h3 className="tracking-status-text" style={{ margin: '5px 0', fontWeight: '900', color: currentStatus.color }}>
                {currentStatus.icon} {currentStatus.label}
              </h3>
              {order.status === 4 && order.deliveredAt && (
                <p style={{ margin: 0, fontWeight: '700', fontSize: '14px' }}>
                  Received on: {new Date(order.deliveredAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="tracking-step text-md-end" style={{ fontWeight: '900', fontSize: '1.2rem' }}>
              STEP {order.status} / 4
            </div>
          </div>

          {/* VISUAL PROGRESS BAR STEPS */}
          <div className="tracking-progress" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {[0, 1, 2, 3, 4].map((step) => (
              <div
                key={step}
                style={{
                  height: '12px',
                  flex: 1,
                  backgroundColor: order.status >= step ? (order.status === 4 ? '#28a745' : '#000') : '#e0e0e0',
                  transition: 'background-color 0.4s ease'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {order.isCancelled && (
        <Alert className="cancel-alert mb-5">
          <Row className="align-items-center">
            <Col xs={2} sm={1} className="text-center">
              <i className="fas fa-exclamation-triangle fa-2x"></i>
            </Col>
            <Col>
              <div style={{ fontWeight: '900', fontSize: '1.1rem' }}>ORDER TERMINATED</div>
              <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>REASON: {order.cancelReason?.toUpperCase() || 'NOT SPECIFIED'}</div>
            </Col>
          </Row>
        </Alert>
      )}

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3 className="section-title" style={sectionTitleStyle}>Shipping Log</h3>
              <p style={{ fontWeight: '700', margin: 0 }}>{userInfo?.name?.toUpperCase()}</p>
              <p className="text-muted">{shipping.address}, {shipping.city}, {shipping.postalCode}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3 className="section-title" style={sectionTitleStyle}>Payment Information</h3>
              <p style={{ fontWeight: '700', margin: 0 }}>METHOD: {order.paymentMethod?.toUpperCase() || 'UNKNOWN'}</p>
              <p className="text-muted">Status: {order.isPaid ? 'CONFIRMED' : 'PENDING'}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3 className="section-title" style={sectionTitleStyle}>Manifest</h3>
              {itemsList.map((item, index) => (
                <Row key={index} className="align-items-center mb-3" style={{ borderBottom: '1px solid #f4f4f4', paddingBottom: '15px' }}>
                  <Col xs={12} md={2} className="text-center text-md-start mb-3 mb-md-0">
                    <Image src={item.image} alt={item.name} fluid style={{ borderRadius: 0, border: '1px solid #eee', maxWidth: '80px', height: 'auto' }} />
                  </Col>
                  <Col xs={12} md={7}>
                    <div className="manifest-name" style={{ fontWeight: '800', fontSize: '14px' }}>{item.name?.toUpperCase()}</div>
                    <div className="text-muted small">QTY: {item.qty}</div>
                  </Col>
                  <Col xs={12} md={3} className="text-end text-md-end">
                    <div className="manifest-price" style={{ fontWeight: '700' }}>
                      ₹{(item.qty * item.price).toFixed(2)}
                    </div>
                  </Col>
                </Row>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card className="receipt-card" style={receiptCardStyle}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '25px', textAlign: 'center' }}>SUMMARY</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span className="text-muted">Subtotal</span>
              <span style={{ fontWeight: '700' }}>₹{order.totalPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <span className="text-muted">Shipping</span>
              <span style={{ color: '#28a745', fontWeight: '700' }}>FREE</span>
            </div>
            
            <div className="receipt-total" style={{ borderTop: '2px solid #000', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: '900' }}>
              <span>TOTAL</span>
              <span>₹{order.totalPrice.toFixed(2)}</span>
            </div>

            {!order.isCancelled && order.status < 1 && (
              <>
                <Button 
                  className="btn-cancel w-100 mt-4 py-3" 
                  onClick={() => setShowCancelModal(true)}
                >
                  Request Cancellation
                </Button>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#ff4444', textAlign: 'center', marginTop: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  * Orders cannot be cancelled once accepted by us.
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton style={{ background: '#000', color: '#fff' }}>
          <Modal.Title style={{ fontWeight: '900', letterSpacing: '1px' }}>CANCEL ORDER</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '30px' }}>
          <Form.Group controlId="cancelReason">
            <Form.Label style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '12px', color: '#888' }}>Reason for Termination</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={4} 
              style={{ borderRadius: 0, border: '2px solid #000', fontWeight: '600' }}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Tell us why..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', padding: '0 30px 30px 30px' }}>
          <Button variant="link" style={{ color: '#000', textDecoration: 'none', fontWeight: '700', minHeight: '44px', padding: '12px 20px' }} onClick={() => setShowCancelModal(false)}>
            GO BACK
          </Button>
          <Button 
            style={{ backgroundColor: '#000', border: 'none', borderRadius: 0, padding: '12px 25px', fontWeight: '800', minHeight: '44px' }} 
            onClick={cancelOrderHandler} 
            disabled={cancelLoading}
          >
            {cancelLoading ? <span>[ TERMINATING <span className="terminal-cursor">█</span> ]</span> : 'CONFIRM TERMINATION'}
          </Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </div>
  );
};

export default OrderDetailsScreen;