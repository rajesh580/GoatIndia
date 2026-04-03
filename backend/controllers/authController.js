const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

// @desc    Register a new user (Final Step after Signup OTP)
// @route   POST /api/auth/signup
const registerUser = async (req, res) => {
  const { name, email, password, otp, generatedOtp } = req.body;
  try {
    // DEBUG: Logs the comparison to your terminal
    console.log(`Signup Verify - Received: ${otp}, Expected: ${generatedOtp}`);

    if (!otp || String(otp) !== String(generatedOtp)) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Note: Password hashing is handled by the Sequelize hook in User model
    const user = await User.create({ name, email, password });
    
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
};

// @desc    Send OTP for Signup (New User)
// @route   POST /api/auth/signup-otp
const signupOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Sends a real email using your nodemailer utility
    await sendEmail({ 
      email, 
      subject: 'Verify Your GOAT INDIA Account', 
      otp 
    });

    // Send OTP back to frontend to store in state for comparison during registration
    res.status(200).json({ message: 'Verification code sent', otp });
  } catch (error) {
    console.error('Signup OTP Error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user && (await user.matchPassword(password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Google OAuth Login
// @route   POST /api/auth/google
const googleLogin = async (req, res) => {
  const { name, email, googleId } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      // Create user without password for Google users
      user = await User.create({ name, email, googleId, password: null });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Google Login Failed' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (user) {
    user.name = req.body.name || user.name;
    const updatedUser = await user.save();
    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser.id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// --- FORGOT PASSWORD FLOW ---

// @desc    Send OTP for Password Reset (Existing User)
// @route   POST /api/auth/forgot-password (Mapped to sendOTP in your routes)
const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to DB with 10-minute expiry
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60000);
    await user.save();

    await sendEmail({ 
      email: user.email, 
      subject: 'GOAT INDIA - Password Reset Request', 
      otp 
    });

    res.json({ message: 'OTP sent successfully to your email' });
  } catch (error) {
    console.error('Forgot Pass OTP Error:', error);
    res.status(500).json({ message: 'Error sending reset OTP' });
  }
};

// @desc    Verify OTP and Update Password
// @route   POST /api/auth/reset-password (Mapped to verifyOTP in your routes)
const verifyOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    // Check if user exists, OTP matches, and is not expired
    if (!user || user.otp !== otp || new Date() > user.otpExpire) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update password (Sequelize hook will hash this)
    user.password = newPassword;
    user.otp = null; // Clear OTP after success
    user.otpExpire = null;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
};

// @desc    Update user cart
// @route   PUT /api/auth/cart
const updateUserCart = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      user.cart = JSON.stringify(req.body.cartItems);
      await user.save();
      res.json({ message: 'Cart updated' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
};

// @desc    Get user cart
// @route   GET /api/auth/cart
const getUserCart = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      res.json(user.cart ? JSON.parse(user.cart) : []);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

module.exports = { 
  authUser, 
  registerUser, 
  googleLogin, 
  updateUserProfile, 
  sendOTP, 
  verifyOTP, 
  signupOTP,
  updateUserCart,
  getUserCart
};