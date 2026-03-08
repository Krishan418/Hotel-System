// ============================================
// routes/roomRoutes.js — Room Management Routes
// ============================================
//
// ROUTE ORGANIZATION:
//   Public routes    → No middleware needed
//   Admin routes     → auth + roleCheck('admin')
//   Admin/Staff      → auth + roleCheck('admin', 'staff')
//
// ROUTE ORDER MATTERS:
//   Express matches routes TOP to BOTTOM.
//   Static routes (like '/stats') must come BEFORE
//   dynamic routes (like '/:id'), otherwise Express
//   thinks "stats" is an ID!
//
// EXAMPLE:
//   GET /api/rooms/stats   → matches '/stats' route ✅
//   GET /api/rooms/507f... → matches '/:id' route ✅
//   But if '/:id' comes first, 'stats' would match as an ID ❌

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  changeStatus,
  getRoomStats,
} = require('../controllers/roomController');

// Import middleware
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// ============================================
// PUBLIC ROUTES (anyone can browse rooms)
// ============================================

// @route   GET /api/rooms
// @desc    Get all rooms (with optional query filters)
// @access  Public
//
// Query examples:
//   GET /api/rooms                           → all rooms
//   GET /api/rooms?type=suite                → only suites
//   GET /api/rooms?status=available          → only available
//   GET /api/rooms?minPrice=5000&maxPrice=15000 → price range
//   GET /api/rooms?capacity=4                → fits 4+ guests
//   GET /api/rooms?type=double&status=available → combine filters
router.get('/', getAllRooms);

// ============================================
// ADMIN ROUTES (must be logged in as admin)
// ============================================
// IMPORTANT: Static routes ('/stats') must come BEFORE '/:id'

// @route   GET /api/rooms/stats
// @desc    Get room statistics (total, available, occupancy rate)
// @access  Private/Admin
router.get('/stats', auth, roleCheck('admin'), getRoomStats);

// @route   POST /api/rooms
// @desc    Create a new room
// @access  Private/Admin
router.post('/', auth, roleCheck('admin'), createRoom);

// ============================================
// ROUTES WITH :id PARAMETER
// ============================================
// These routes use req.params.id from the URL

// @route   GET /api/rooms/:id
// @desc    Get single room details
// @access  Public
router.get('/:id', getRoomById);

// @route   PUT /api/rooms/:id
// @desc    Update room details
// @access  Private/Admin
router.put('/:id', auth, roleCheck('admin'), updateRoom);

// @route   DELETE /api/rooms/:id
// @desc    Delete room (soft delete)
// @access  Private/Admin
router.delete('/:id', auth, roleCheck('admin'), deleteRoom);

// @route   PUT /api/rooms/:id/status
// @desc    Change room status (available/occupied/maintenance/reserved)
// @access  Private/Admin or Staff
router.put('/:id/status', auth, roleCheck('admin', 'staff'), changeStatus);

module.exports = router;
