// ============================================
// middleware/roleCheck.js — Role-Based Access Control
// ============================================
//
// WHAT THIS DOES:
//   After auth.js confirms the user is logged in, this middleware
//   checks if the user has the RIGHT ROLE to access a route.
//
// EXAMPLE:
//   Only admins should be able to delete rooms.
//   Only delivery persons should see delivery orders.
//
// HOW TO USE:
//   const auth = require('./middleware/auth');
//   const roleCheck = require('./middleware/roleCheck');
//
//   // Only admin can access this route:
//   router.delete('/rooms/:id', auth, roleCheck('admin'), deleteRoom);
//
//   // Admin OR staff can access this route:
//   router.put('/bookings/:id', auth, roleCheck('admin', 'staff'), updateBooking);
//
// HOW IT WORKS:
//   roleCheck('admin', 'staff') returns a middleware function.
//   That function checks if req.user.role is in the allowed list.
//   This pattern is called a "higher-order function" — a function
//   that returns another function.

const roleCheck = (...allowedRoles) => {
  // This is the actual middleware function
  return (req, res, next) => {
    // req.user is set by the auth middleware (runs before this)
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized — please login first'));
    }

    // Check if the user's role is in the allowed roles list
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403); // 403 = Forbidden (you're logged in but not allowed)
      return next(
        new Error(
          `Access denied — requires ${allowedRoles.join(' or ')} role. Your role: ${req.user.role}`
        )
      );
    }

    // User has the right role, continue to the controller
    next();
  };
};

module.exports = roleCheck;
