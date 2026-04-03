const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // Signs a new token using your JWT_SECRET from .env
  // The token will expire in 30 days
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;