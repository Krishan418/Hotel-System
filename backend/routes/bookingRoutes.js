// ============================================
// routes/bookingRoutes.js — Room Booking Routes
// ============================================
//
// ROUTE SUMMARY:
//   /available       → Search rooms (public-facing but needs dates)
//   /                → List all bookings / Create booking
//   /:id             → Get / Modify single booking
//   /:id/cancel      → Cancel a booking
//   /:id/checkin     → Staff checks guest in
//   /:id/checkout    → Staff checks guest out
//
// REMEMBER: Static routes BEFORE dynamic /:id routes!

const express = require('express');
const router = express.Router();

const {
  searchAvailableRooms,
  getAllBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  modifyBooking,
  checkIn,
  checkOut,
} = require('../controllers/bookingController');

const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// ============================================
// SEARCH ROUTE (public — anyone can search)
// ============================================

// @route   GET /api/bookings/available?checkIn=2026-03-15&checkOut=2026-03-18
// @desc    Search available rooms for given dates
// @access  Public
router.get('/available', searchAvailableRooms);

// ============================================
// BOOKING CRUD (logged-in users)
// ============================================

// @route   GET /api/bookings
// @desc    List bookings (customer sees own, staff/admin see all)
// @access  Private
router.get('/', auth, getAllBookings);

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (Customer)
router.post('/', auth, roleCheck('customer', 'admin'), createBooking);

// ============================================
// SINGLE BOOKING ROUTES (with :id parameter)
// ============================================

// @route   GET /api/bookings/:id
// @desc    Get single booking details
// @access  Private
router.get('/:id', auth, getBookingById);

// @route   PUT /api/bookings/:id
// @desc    Modify booking (dates, guests, special requests)
// @access  Private (Customer — own, Admin — any)
router.put('/:id', auth, modifyBooking);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private (Customer — own, Admin — any)
router.put('/:id/cancel', auth, cancelBooking);

// ============================================
// STAFF OPERATIONS (check-in / check-out)
// ============================================

// @route   PUT /api/bookings/:id/checkin
// @desc    Check-in a guest → room becomes 'occupied'
// @access  Private (Staff, Admin)
router.put('/:id/checkin', auth, roleCheck('staff', 'admin'), checkIn);

// @route   PUT /api/bookings/:id/checkout
// @desc    Check-out a guest → room becomes 'available'
// @access  Private (Staff, Admin)
router.put('/:id/checkout', auth, roleCheck('staff', 'admin'), checkOut);

module.exports = router;
