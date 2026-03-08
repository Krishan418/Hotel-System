// ============================================
// server.js — Entry Point for the Backend
// ============================================
//
// This is the FIRST file that runs when you start the server.
//
// WHAT HAPPENS WHEN THE SERVER STARTS:
//   Step 1: Load environment variables from .env file
//   Step 2: Import all required packages
//   Step 3: Create the Express app
//   Step 4: Attach middleware (code that runs before every request)
//   Step 5: Define API routes (where requests go)
//   Step 6: Attach error handler (catches any errors)
//   Step 7: Connect to MongoDB
//   Step 8: Start listening for requests
//
// HOW TO RUN:
//   Development: npm run dev   (auto-restarts on file changes)
//   Production:  npm start     (runs once)

// ========== STEP 1: Load Environment Variables ==========
// dotenv reads the .env file and makes those values available
// as process.env.VARIABLE_NAME throughout the entire app.
// We MUST call this before using any env variables!
const dotenv = require('dotenv');
dotenv.config();

// ========== STEP 2: Import Required Packages ==========

// express — The web framework that handles all HTTP requests
//   Think of it as a post office: requests come in, Express
//   routes them to the right handler, and sends back a response.
const express = require('express');

// cors — Cross-Origin Resource Sharing
//   By default, browsers block requests from one domain to another.
//   Our React app (localhost:5173) needs to talk to Express (localhost:5000).
//   CORS tells the browser: "It's okay, let this request through."
const cors = require('cors');

// path — Built-in Node.js module for working with file paths
const path = require('path');

// connectDB — Our custom function to connect to MongoDB
const connectDB = require('./config/db');

// errorHandler — Our custom middleware that catches and formats errors
const errorHandler = require('./middleware/errorHandler');

// ========== STEP 3: Create the Express App ==========
// This creates our application. Everything else attaches to this.
const app = express();

// ========== STEP 4: Attach Middleware ==========
//
// WHAT IS MIDDLEWARE?
//   Middleware = functions that run BETWEEN receiving a request
//   and sending a response. They can:
//     - Parse request data (JSON body)
//     - Check authentication  
//     - Log requests
//     - Handle errors
//
// ORDER MATTERS! Middleware runs in the order you add it.
//
//   Request → [cors] → [json parser] → [url parser] → [route handler] → Response
//                                                            ↓
//                                                     [error handler]

// 4a. CORS — Allow the frontend to make requests to this server
//   Without this, your browser would block all API calls from React.
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',  // Only allow our frontend
  credentials: true,  // Allow cookies/auth headers to be sent
}));

// 4b. JSON Body Parser — Parses incoming JSON data
//   When the frontend sends data (like login form), it arrives as JSON.
//   This middleware reads that JSON and puts it in req.body so we can use it.
//   Example: req.body.email, req.body.password
app.use(express.json());

// 4c. URL-Encoded Body Parser — Parses form data
//   Some forms send data as URL-encoded strings (like: name=John&email=john@mail.com)
//   This middleware parses that format too.
//   "extended: true" allows nested objects in form data.
app.use(express.urlencoded({ extended: true }));

// 4d. Request Logger — Logs every incoming request (development only)
//   This helps you see what requests are hitting your server.
//   In production, you'd use a proper logging library.
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url}`);
    next(); // IMPORTANT: always call next() or the request hangs!
  });
}

// ========== STEP 5: Define API Routes ==========
//
// HOW ROUTING WORKS:
//   app.use('/api/auth', authRoutes) means:
//   - Any request starting with /api/auth goes to authRoutes
//   - Inside authRoutes, POST '/login' becomes POST '/api/auth/login'
//
// Uncomment each route as you build that module.

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/weddings', require('./routes/weddingRoutes'));
// app.use('/api/menu', require('./routes/menuRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/pool', require('./routes/poolRoutes'));
// app.use('/api/payments', require('./routes/paymentRoutes'));
// app.use('/api/deliveries', require('./routes/deliveryRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// ========== STEP 5b: Base API Routes ==========
//
// These routes are active right now for testing.

// Health Check — Quick way to test if the server is running.
// Visit http://localhost:5000/ in your browser to see the response.
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏨 Hotel Management System API is running!',
    version: '1.0.0',
    endpoints: {
      health: 'GET /',
      api: 'GET /api',
    },
  });
});

// API Welcome — Lists all available API route groups.
// Visit http://localhost:5000/api to see the response.
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Hotel Management System API',
    availableRoutes: {
      auth: '/api/auth — Login, Register, Profile',
      rooms: '/api/rooms — Room management',
      bookings: '/api/bookings — Booking management',
      weddings: '/api/weddings — Wedding packages',
      menu: '/api/menu — Restaurant menu',
      orders: '/api/orders — Food orders',
      pool: '/api/pool — Pool slot booking',
      payments: '/api/payments — Payment processing',
      deliveries: '/api/deliveries — Delivery tracking',
      users: '/api/users — User management (Admin)',
    },
  });
});

// ========== STEP 6: Error Handling Middleware ==========
//
// This MUST be the LAST middleware added.
// It catches any errors thrown by route handlers above.
//
// WHY IS IT LAST?
//   Express processes middleware in order. If a route handler
//   throws an error, Express skips all remaining middleware
//   and jumps to the first error handler it finds (this one).
//
// HOW TO USE IT IN CONTROLLERS:
//   throw new Error('Something went wrong');  — triggers this handler
//   OR
//   next(error);  — passes error to this handler

app.use(errorHandler);

// Handle 404 — Route not found
// This catches any request that didn't match a route above
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ========== STEP 7 & 8: Connect to Database & Start Server ==========

const PORT = process.env.PORT || 5000;

// We connect to MongoDB FIRST, then start the server.
// If MongoDB connection fails, the server won't start.
const startServer = async () => {
  try {
    // Step 7: Connect to MongoDB
    await connectDB();

    // Step 8: Start listening for HTTP requests
    app.listen(PORT, () => {
      console.log('');
      console.log('='.repeat(50));
      console.log('🏨 Hotel Management System API');
      console.log('='.repeat(50));
      console.log(`🚀 Server:    http://localhost:${PORT}`);
      console.log(`📊 API Base:  http://localhost:${PORT}/api`);
      console.log(`🌍 Mode:      ${process.env.NODE_ENV || 'development'}`);
      console.log('='.repeat(50));
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
