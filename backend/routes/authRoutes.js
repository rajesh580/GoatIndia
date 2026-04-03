const express = require('express');
const router = express.Router();

// 1. Import functions that actually exist in your authController.js
const { 
  authUser, 
  registerUser, 
  googleLogin,
  updateUserProfile,
  sendOTP,    // This handles the forgot-password logic
  verifyOTP,  // This handles the reset-password logic
  signupOTP,
  getUserCart,
  updateUserCart
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// --- PUBLIC ROUTES ---

// Standard Login & Signup
router.post('/login', authUser);
router.post('/signup', registerUser);

// Google OAuth Login
router.post('/google', googleLogin);

// Signup specific OTP
router.post('/signup-otp', signupOTP); 

// --- FORGOT PASSWORD FLOW ---
// We map the routes your frontend is calling to the functions in your controller
router.post('/forgot-password', sendOTP);
router.post('/reset-password', verifyOTP);


// --- PROFILE ROUTES ---
router.route('/profile')
  .put(protect, updateUserProfile);

// --- CART ROUTES ---
router.route('/cart').get(protect, getUserCart).put(protect, updateUserCart);

// 2. EXPORT the router
module.exports = router;