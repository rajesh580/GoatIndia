const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const path = require('path');
const { sequelize } = require('./config/database');

// 1. Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const heroRoutes = require('./routes/heroRoutes'); 

// 1.5 IMPORT MODELS
const Product = require('./models/Product');
const Review = require('./models/Review');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });
Review.belongsTo(Product, { foreignKey: 'productId' });

// OrderItems Association (FIXES THE MISSING SIZE ISSUE)
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// 2. Load environment variables
dotenv.config();

// 3. Initialize app
const app = express();

// Security Headers
app.use(helmet({ crossOriginResourcePolicy: false })); // Keeps local dev images working

// 4. Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Security Headers & Request Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// 4.5 Serve Static Frontend Files (Production)
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// 5. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/heroslides', heroRoutes); 

// 6. Serve React App for all non-API routes (SPA Routing)
app.use((req, res, next) => {
  const apiPrefix = req.path.startsWith('/api');
  const staticFile = req.path.startsWith('/static') || req.path === '/asset-manifest.json' || req.path === '/favicon.ico' || req.path === '/manifest.json' || req.path === '/robots.txt';

  if (apiPrefix || staticFile || req.path.startsWith('/sockjs-node')) {
    return next();
  }

  return res.sendFile(path.join(buildPath, 'index.html'));
});

// 7. Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// 8atch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 7. Database Sync & Server Start
// Removed { alter: true } to prevent ER_TOO_MANY_KEYS indexing bug on server restarts
console.log('Starting database sync...');
sequelize.sync()
  .then(() => {
    console.log('MySQL Database & Tables synced for GOAT INDIA');
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Server is listening and ready to accept connections`);
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('Shutting down server...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  })
  .catch(err => {
    console.error('Sequelize sync error:', err);
    console.error('Error details:', err.message);
    process.exit(1); 
  });