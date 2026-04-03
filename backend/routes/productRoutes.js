const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  createProduct, 
  getProductById,
  createProductReview,
  getProductReviews,
  getRecommendedProducts // Added import
} = require('../controllers/productController');

// 1. Static/Specialized routes must come FIRST
router.route('/recommended').get(getRecommendedProducts);

// 2. Standard Product Routes
router.route('/')
  .get(getProducts)
  .post(createProduct); 

// 3. Dynamic ID routes must come LAST
router.route('/:id').get(getProductById);

// --- REVIEW ROUTES ---
router.route('/:id/reviews')
  .get(getProductReviews)
  .post(createProductReview);

module.exports = router;