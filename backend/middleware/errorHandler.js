// ============================================
// middleware/errorHandler.js — Global Error Handler
// ============================================
// This middleware catches any errors thrown in our routes/controllers
// and sends a clean, consistent error response to the client.
//
// Without this, Express would send ugly HTML error pages.

const errorHandler = (err, req, res, next) => {
  // Log error for debugging (only in development)
  console.error(`❌ Error: ${err.message}`);

  // Get the status code (default to 500 = Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    // Only show error stack trace in development (not in production)
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
