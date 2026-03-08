// ============================================
// models/RoomBooking.js — Room Booking Collection Schema
// ============================================
//
// THIS COLLECTION STORES:
//   Every room reservation made by customers.
//
// RELATIONSHIPS:
//   - Each booking belongs to ONE user (the guest)
//   - Each booking is for ONE room
//   This is done using "references" (ObjectId) — MongoDB's way
//   of linking documents across collections.
//
// WHAT IS ObjectId?
//   Every MongoDB document gets a unique _id (like "507f1f77bcf86cd799439011").
//   When we store a reference, we store that _id to point to another document.
//   We can then use .populate() to fetch the full document.
//   Example: RoomBooking.find().populate('user').populate('room')

const mongoose = require('mongoose');

const roomBookingSchema = new mongoose.Schema(
  {
    // ---------- Who booked ----------
    user: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to another document
      ref: 'User',                           // Which collection to reference
      required: [true, 'Guest is required'],
    },

    // ---------- Which room ----------
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room is required'],
    },

    // ---------- Dates ----------
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },

    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },

    // ---------- Guests ----------
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required'],
    },

    // ---------- Pricing ----------
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Price cannot be negative'],
    },

    // ---------- Status ----------
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show'],
      default: 'pending',
      //
      // STATUS FLOW:
      //   pending     → Customer made the booking, waiting for confirmation
      //   confirmed   → Booking is confirmed
      //   checked-in  → Guest has arrived and is staying
      //   checked-out → Guest has left
      //   cancelled   → Booking was cancelled
      //   no-show     → Guest never arrived
    },

    // ---------- Special Requests ----------
    specialRequests: {
      type: String,
      trim: true,
      // Example: "Extra pillows, late check-out, baby crib"
    },

    // ---------- Payment ----------
    isPaid: {
      type: Boolean,
      default: false,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',       // Links to the Payment collection
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RoomBooking', roomBookingSchema);
