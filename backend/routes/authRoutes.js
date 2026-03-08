// ============================================
// routes/authRoutes.js — Authentication Routes
// ============================================
//
// WHAT IS A ROUTE FILE?
//   A route file maps URLs to controller functions.
//   Think of it as a phone directory:
//     URL (phone number) → Controller function (person to call)
//
// HOW ROUTES WORK:
//   When a request comes to the server, Express checks each route
//   in order until it finds a match. Then it runs the controller.
//
//   POST /api/auth/register → runs authController.register
//   POST /api/auth/login    → runs authController.login
//   GET  /api/auth/me       → runs auth middleware → authController.getMe
//
// ROUTE METHODS:
//   GET    = Read data      (fetch profile)
//   POST   = Create data    (register, login)
//   PUT    = Update data    (update profile)
//   DELETE = Delete data    (delete account)

const express = require('express');

// express.Router() creates a mini-app that handles routes
// We define routes here, then attach them to the main app in server.js
const router = express.Router();

// Import controller functions
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

// Import auth middleware
const auth = require('../middleware/auth');

// ============================================
// PUBLIC ROUTES (no login required)
// ============================================

// @route   POST /api/auth/register
// @desc    Create a new user account
// @access  Public
//
// What the frontend sends (req.body):
//   { "name": "John", "email": "john@mail.com", "password": "123456", "phone": "0771234567" }
//
// What the server responds:
//   { "success": true, "token": "eyJhbG...", "user": { "_id": "...", "name": "John", ... } }
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login and get JWT token
// @access  Public
//
// What the frontend sends:
//   { "email": "john@mail.com", "password": "123456" }
//
// What the server responds:
//   { "success": true, "token": "eyJhbG...", "user": { ... } }
router.post('/login', login);

// ============================================
// PRIVATE ROUTES (login required — auth middleware runs first)
// ============================================
// When we write: router.get('/me', auth, getMe)
//   1. Request arrives at GET /api/auth/me
//   2. "auth" middleware runs first → verifies JWT token
//   3. If token is valid, "getMe" controller runs
//   4. If token is invalid, auth middleware sends 401 error

// @route   GET /api/auth/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, getMe);

// @route   PUT /api/auth/me
// @desc    Update current user's profile (name, phone, address)
// @access  Private
router.put('/me', auth, updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Change password (requires current password)
// @access  Private
router.put('/change-password', auth, changePassword);

// Export the router
module.exports = router;
