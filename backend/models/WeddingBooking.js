// ============================================
// models/WeddingBooking.js — Wedding Booking Collection Schema
// ============================================
//
// THIS COLLECTION STORES:
//   Wedding/event venue reservations.
//
// RELATIONSHIPS:
//   - Each booking belongs to ONE user (the customer)
//   - Each booking is for ONE wedding hall

const mongoose = require('mongoose');

const weddingBookingSchema = new mongoose.Schema(
  {
    // ---------- Who booked ----------
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },

    // ---------- Which hall ----------
    weddingHall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeddingHall',
      required: [true, 'Wedding hall is required'],
    },

    // ---------- Event Details ----------
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },

    eventType: {
      type: String,
      enum: ['wedding', 'reception', 'engagement', 'birthday', 'conference', 'other'],
      default: 'wedding',
    },

    expectedGuests: {
      type: Number,
      required: [true, 'Expected number of guests is required'],
      min: [1, 'At least 1 guest expected'],
    },

    // ---------- Services Requested ----------
    // Which services from the hall's offerings they want
    selectedServices: {
      type: [String],
      default: [],
      // Example: ['Decoration', 'Catering', 'Photography']
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
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },

    // ---------- Special Requests ----------
    specialRequests: {
      type: String,
      trim: true,
    },

    // ---------- Contact ----------
    contactPhone: {
      type: String,
      trim: true,
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

module.exports = mongoose.model('WeddingBooking', weddingBookingSchema);
