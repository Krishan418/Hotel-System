// ============================================
// models/PoolBooking.js — Pool Booking Collection Schema
// ============================================
//
// THIS COLLECTION STORES:
//   Swimming pool time-slot reservations.
//
// HOW POOL BOOKING WORKS:
//   1. Admin defines available time slots and capacity
//   2. Customer picks a date and time slot
//   3. System checks if capacity allows more bookings
//   4. If yes, booking is created
//
// RELATIONSHIPS:
//   - Each booking belongs to ONE user (the customer)

const mongoose = require('mongoose');

const poolBookingSchema = new mongoose.Schema(
  {
    // ---------- Who booked ----------
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },

    // ---------- When ----------
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },

    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      // Example: "08:00 AM - 10:00 AM", "10:00 AM - 12:00 PM"
    },

    // ---------- Details ----------
    numberOfPersons: {
      type: Number,
      required: [true, 'Number of persons is required'],
      min: [1, 'At least 1 person is required'],
    },

    // ---------- Pricing ----------
    pricePerPerson: {
      type: Number,
      required: [true, 'Price per person is required'],
      min: [0, 'Price cannot be negative'],
    },

    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },

    // ---------- Status ----------
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },

    // ---------- Payment ----------
    isPaid: {
      type: Boolean,
      default: false,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PoolBooking', poolBookingSchema);
