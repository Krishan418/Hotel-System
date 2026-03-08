// ============================================
// utils/generateToken.js — Create JWT Tokens
// ============================================
// JWT (JSON Web Token) is like a digital ID card.
// When a user logs in, we create a token containing their
// user ID and role. They send this token with every request
// so we know who they are without checking the database.

const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role }, // Payload: data stored in the token
    process.env.JWT_SECRET,      // Secret key: used to sign the token
    { expiresIn: process.env.JWT_EXPIRE || '7d' } // Expiration: token is valid for 7 days
  );
};

module.exports = generateToken;
