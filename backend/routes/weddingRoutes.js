// ============================================
// routes/weddingRoutes.js — Wedding Hall & Booking Routes
// ============================================
//
// This file handles TWO groups of routes:
//
//   /api/weddings/halls/*     → Manage wedding venues
//   /api/weddings/bookings/*  → Manage wedding reservations
//
// We use Express sub-routes to keep things organized.
// Think of it as having two mini-routers inside one file.

const express = require('express');
const router = express.Router();

const {
  // Hall controllers
  getAllHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
  checkHallAvailability,
  // Booking controllers
  getAllWeddingBookings,
  getWeddingBookingById,
  createWeddingBooking,
  updateWeddingBookingStatus,
  cancelWeddingBooking,
} = require('../controllers/weddingController');

const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// ============================================
// HALL ROUTES — /api/weddings/halls
// ============================================

// @route   GET /api/weddings/halls
// @desc    Browse all wedding halls (optional: ?minCapacity=200&maxPrice=300000)
// @access  Public
router.get('/halls', getAllHalls);

// @route   POST /api/weddings/halls
// @desc    Create a new hall
// @access  Private/Admin
router.post('/halls', auth, roleCheck('admin'), createHall);

// @route   GET /api/weddings/halls/:id/availability?date=2026-06-15
// @desc    Check if hall is available on a specific date
// @access  Public
router.get('/halls/:id/availability', checkHallAvailability);

// @route   GET /api/weddings/halls/:id
// @desc    Get single hall details
// @access  Public
router.get('/halls/:id', getHallById);

// @route   PUT /api/weddings/halls/:id
// @desc    Update hall details
// @access  Private/Admin
router.put('/halls/:id', auth, roleCheck('admin'), updateHall);

// @route   DELETE /api/weddings/halls/:id
// @desc    Delete hall (soft delete)
// @access  Private/Admin
router.delete('/halls/:id', auth, roleCheck('admin'), deleteHall);

// ============================================
// BOOKING ROUTES — /api/weddings/bookings
// ============================================

// @route   GET /api/weddings/bookings
// @desc    List wedding bookings (customer sees own, admin sees all)
// @access  Private
router.get('/bookings', auth, getAllWeddingBookings);

// @route   POST /api/weddings/bookings
// @desc    Book a wedding hall
// @access  Private (Customer)
router.post('/bookings', auth, roleCheck('customer', 'admin'), createWeddingBooking);

// @route   GET /api/weddings/bookings/:id
// @desc    Get single wedding booking
// @access  Private
router.get('/bookings/:id', auth, getWeddingBookingById);

// @route   PUT /api/weddings/bookings/:id/status
// @desc    Update booking status (pending/confirmed/completed/cancelled)
// @access  Private/Admin
router.put('/bookings/:id/status', auth, roleCheck('admin'), updateWeddingBookingStatus);

// @route   PUT /api/weddings/bookings/:id/cancel
// @desc    Cancel wedding booking
// @access  Private (Customer — own, Admin — any)
router.put('/bookings/:id/cancel', auth, cancelWeddingBooking);

module.exports = router;
