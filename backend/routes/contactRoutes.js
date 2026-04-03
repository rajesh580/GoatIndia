const express = require('express'); // Missing Line 1
const router = express.Router();    // Missing Line 2
const sendEmail = require('../utils/sendEmail');

// routes/contactRoutes.js
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body; // 1. Get message from frontend

  try {
    await sendEmail({
      email: process.env.EMAIL_USER, 
      subject: `CONTACT FORM: ${subject}`,
      message: message, // 2. MUST include this line to pass the text
      name: name,       // Optional: pass name for the template
      userEmail: email, // Optional: pass sender email
      otp: "INQUIRY"    // This triggers the Inquiry layout in our utility
    });

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router;