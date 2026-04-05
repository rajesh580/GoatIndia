const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Generate HTML content based on email type
  let htmlContent = options.html; // Use provided HTML if available

  if (!htmlContent) {
    if (options.otp && options.otp !== "INQUIRY") {
      // OTP Email Template
      htmlContent = `
        <div style="font-family: monospace, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 30px; color: #000;">
          <h1 style="text-transform: uppercase; font-weight: 900; letter-spacing: 2px; text-align: center; border-bottom: 4px solid #000; padding-bottom: 20px; margin-top: 0;">GOAT INDIA</h1>
          <h2 style="text-align: center; text-transform: uppercase; letter-spacing: 1px;">[ VERIFICATION CODE ]</h2>
          <div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; background-color: #000; color: #fff; padding: 20px; font-size: 32px; font-weight: 900; letter-spacing: 5px; border: 4px solid #000;">
              ${options.otp}
            </div>
          </div>
          <p style="text-align: center; font-weight: 700; font-size: 16px;">Enter this code to complete your verification</p>
          <p style="text-align: center; font-size: 14px; color: #666; margin-top: 20px;">This code will expire in 10 minutes</p>
          <div style="margin-top: 40px; padding: 20px; background-color: #f4f4f4; text-align: center; border: 2px dashed #000;">
            <p style="margin: 0; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Welcome to GOAT INDIA</p>
            <p style="margin: 10px 0 0 0; font-size: 12px; font-weight: 600; color: #666;">For support, contact support@goatindia.com</p>
          </div>
        </div>
      `;
    } else if (options.message) {
      // Contact Form Email Template
      htmlContent = `
        <div style="font-family: monospace, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 30px; color: #000;">
          <h1 style="text-transform: uppercase; font-weight: 900; letter-spacing: 2px; text-align: center; border-bottom: 4px solid #000; padding-bottom: 20px; margin-top: 0;">GOAT INDIA</h1>
          <h2 style="text-align: center; text-transform: uppercase; letter-spacing: 1px;">[ CUSTOMER INQUIRY ]</h2>
          <div style="margin: 30px 0;">
            <p style="font-weight: 700; margin: 10px 0;"><strong>From:</strong> ${options.name || 'Anonymous'}</p>
            <p style="font-weight: 700; margin: 10px 0;"><strong>Email:</strong> ${options.userEmail || options.email}</p>
            <p style="font-weight: 700; margin: 10px 0;"><strong>Subject:</strong> ${options.subject}</p>
          </div>
          <div style="border: 2px solid #000; padding: 20px; background-color: #f9f9f9;">
            <h3 style="margin-top: 0; text-transform: uppercase;">Message:</h3>
            <p style="font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${options.message}</p>
          </div>
          <div style="margin-top: 40px; padding: 20px; background-color: #f4f4f4; text-align: center; border: 2px dashed #000;">
            <p style="margin: 0; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Thank you for reaching out</p>
            <p style="margin: 10px 0 0 0; font-size: 12px; font-weight: 600; color: #666;">We'll respond within 24 hours</p>
          </div>
        </div>
      `;
    }
  }

  const mailOptions = {
    from: `GOAT INDIA <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;