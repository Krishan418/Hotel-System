// ============================================
// server.js — Entry Point for the Backend
// ============================================
// This is the FIRST file that runs when you start the server.
// It does 3 things:
//   1. Loads environment variables
//   2. Connects to MongoDB
//   3. Starts the Express server

// ---------- Load Packages ----------

// dotenv: Loads variables from .env file (like database URL, port, etc.)
const dotenv = require('dotenv');
dotenv.config();

// express: The web framework that handles HTTP requests
const express = require('express');

// cors: Allows the React frontend (port 5173) to talk to the backend (port 5000)
const cors = require('cors');

// Our custom function to connect to MongoDB
const connectDB = require('./config/db');

// ---------- Create Express App ----------
const app = express();

// ---------- Middleware ----------
// Middleware = code that runs BEFORE your route handlers

// Parse JSON request bodies (when frontend sends data as JSON)
app.use(express.json());

// Allow cross-origin requests (frontend and backend are on different ports)
app.use(cors());

// ---------- API Routes ----------
// Each route file handles a specific group of endpoints
// We will uncomment these as we build each module

// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/rooms', require('./routes/roomRoutes'));
// app.use('/api/bookings', require('./routes/bookingRoutes'));
// app.use('/api/weddings', require('./routes/weddingRoutes'));
// app.use('/api/menu', require('./routes/menuRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/pool', require('./routes/poolRoutes'));
// app.use('/api/payments', require('./routes/paymentRoutes'));
// app.use('/api/deliveries', require('./routes/deliveryRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));

// ---------- Health Check Route ----------
// A simple route to test if the server is running
app.get('/', (req, res) => {
  res.json({ message: 'Hotel Management System API is running!' });
});

// ---------- Connect to Database & Start Server ----------
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});
