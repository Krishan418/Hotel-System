// ============================================
// models/Room.js — Room Collection Schema
// ============================================
//
// THIS COLLECTION STORES:
//   All hotel rooms with their details — room number, type,
//   price, amenities, and current availability status.
//
// WHO USES IT:
//   - Customers: Browse rooms and make bookings
//   - Admin: Add, edit, delete rooms
//   - Staff: See room status for check-in/check-out

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    // ---------- Room Identity ----------
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,          // Each room has a unique number
      trim: true,
    },

    // ---------- Room Details ----------
    type: {
      type: String,
      required: [true, 'Room type is required'],
      enum: ['single', 'double', 'twin', 'suite', 'family'],
      // single = 1 bed, 1 guest
      // double = 1 large bed, 2 guests
      // twin   = 2 separate beds, 2 guests
      // suite  = luxury room with separate living area
      // family = large room for 4+ guests
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: [true, 'Room price is required'],
      min: [0, 'Price cannot be negative'],
    },

    capacity: {
      type: Number,
      required: [true, 'Room capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },

    // ---------- Room Features ----------
    amenities: {
      type: [String],        // Array of strings
      default: [],
      // Example: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony']
    },

    images: {
      type: [String],        // Array of image URLs
      default: [],
    },

    floor: {
      type: Number,
      default: 1,
    },

    // ---------- Status ----------
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance', 'reserved'],
      default: 'available',
      // available   = ready for booking
      // occupied    = guest is currently staying
      // maintenance = being cleaned or repaired
      // reserved    = booked but guest hasn't arrived yet
    },

    isActive: {
      type: Boolean,
      default: true,         // Admin can deactivate rooms
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
