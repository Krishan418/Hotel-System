// ============================================
// middleware/errorHandler.js — Global Error Handler
// ============================================
//
// WHAT IS THIS?
//   Every time a controller does: next(error) or throws an error,
//   Express hands it to THIS middleware for a clean response.
//
// WITHOUT THIS:
//   Express sends a confusing HTML error page.
//   Our API clients (React) need structured JSON, not HTML.
//
// SPECIAL CASES HANDLED:
//   1. Mongoose CastError  — invalid MongoDB ObjectId in URL
//      e.g. GET /api/rooms/not-an-id → "Invalid ID format"
//   2. Mongoose ValidationError — schema validation failed
//      e.g. creating a room without a required field
//   3. Mongoose Duplicate Key Error (code 11000) — unique field clash
//      e.g. email already exists
//   4. JWT Errors — token is malformed or expired
//   5. Everything else — generic 500
//
// HOW ERRORS ARE CREATED IN CONTROLLERS:
//   res.status(400);
//   throw new Error('Something went wrong');
//   The res.statusCode is set BEFORE throwing, so we read it here.

const errorHandler = (err, req, res, next) => {
  // Log for debugging — only in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`❌ [${req.method} ${req.url}] ${err.name}: ${err.message}`);
  }

  // ── 1. Mongoose CastError ──
  // Happens when an invalid ObjectId is passed (e.g. /api/rooms/abc123)
  // MongoDB expects a 24-character hex string; "abc123" fails
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(404).json({
      success: false,
      message: 'Resource not found — invalid ID format',
    });
  }

  // ── 2. Mongoose ValidationError ──
  // Happens when a required field is missing or fails schema validation
  // e.g. creating a room without providing a room number
  // We extract all validation messages and join them into one string
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join('. '),
    });
  }

  // ── 3. MongoDB Duplicate Key Error ──
  // Happens when you try to insert a document that violates a unique index
  // e.g. two users with the same email address
  if (err.code === 11000) {
    // Extract the field name from the error keyPattern
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    const value = err.keyValue ? Object.values(err.keyValue)[0] : '';
    return res.status(400).json({
      success: false,
      message: `"${value}" is already taken. Please use a different ${field}.`,
    });
  }

  // ── 4. JWT Errors ──
  // JsonWebTokenError: token is malformed, has wrong signature, etc.
  // TokenExpiredError: token has passed its expiration date
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token — please login again',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Session expired — please login again',
    });
  }

  // ── 5. All other errors ──
  // The controller sets res.statusCode before throwing:
  //   res.status(400); throw new Error('...');
  // So if statusCode is still 200, it means the error is unexpected → 500
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred',
    // Show stack trace only in development — never in production
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
