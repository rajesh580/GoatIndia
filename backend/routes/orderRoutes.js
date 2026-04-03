const express = require('express');
const router = express.Router();

// 1. Import ALL controller functions, including the new Razorpay ones
const { 
  addOrderItems, 
  getMyOrders, 
  getOrderById, 
  cancelOrder,
  createRazorpayOrder,  // Must be exported from orderController.js
  verifyRazorpayPayment, // Must be exported from orderController.js
  razorpayWebhook
} = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');

// 2. Standard Orders
router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);

// 3. STATIC ROUTES: Razorpay routes MUST go here, above the /:id routes
router.route('/razorpay/webhook').post(razorpayWebhook);
router.route('/razorpay').post(protect, createRazorpayOrder);
router.route('/razorpay/verify').post(protect, verifyRazorpayPayment);

// 4. DYNAMIC ROUTES: Anything with :id goes at the very bottom
router.route('/:id').get(protect, getOrderById);
router.route('/:id/cancel').put(protect, cancelOrder);

module.exports = router;