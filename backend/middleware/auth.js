// ============================================
// middleware/auth.js — Authentication Middleware
// ============================================
//
// WHAT THIS DOES:
//   Checks if the user is logged in by verifying their JWT token.
//   If the token is valid, it adds the user's data to req.user
//   so controllers can know WHO is making the request.
//
// HOW IT WORKS:
//   1. Client sends a request with header: Authorization: Bearer <token>
//   2. This middleware extracts the token from the header
//   3. It verifies the token using our JWT_SECRET
//   4. If valid, it finds the user in the database
//   5. It attaches the user to req.user
//   6. The request continues to the controller
//
// HOW TO USE:
//   router.get('/profile', auth, getProfile);
//   ↑ "auth" runs before "getProfile", protecting the route

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  let token;

  // Step 1: Check if the Authorization header exists and starts with "Bearer"
  // The format is: "Bearer eyJhbGciOiJI..."
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Step 2: Extract the token (remove "Bearer " from the beginning)
      token = req.headers.authorization.split(' ')[1];

      // Step 3: Verify the token
      // jwt.verify() checks if the token was created with our secret
      // and hasn't expired. If invalid, it throws an error.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Step 4: Find the user in the database
      // .select('-password') means "get everything EXCEPT the password"
      // We don't want to carry the password hash around in memory
      req.user = await User.findById(decoded.id).select('-password');

      // Step 5: Check if user still exists (they might have been deleted)
      if (!req.user) {
        res.status(401);
        throw new Error('User no longer exists');
      }

      // Step 6: Continue to the next middleware or controller
      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      res.status(401);
      next(new Error('Not authorized — invalid token'));
    }
  } else {
    // No token was provided at all
    res.status(401);
    next(new Error('Not authorized — no token provided'));
  }
};

module.exports = auth;
