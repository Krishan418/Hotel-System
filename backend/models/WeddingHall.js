// ============================================
// models/WeddingHall.js — Wedding Hall Collection Schema
// ============================================
//
// THIS COLLECTION STORES:
//   All wedding/event venues with their details, capacity,
//   pricing, and available services.

const mongoose = require('mongoose');

const weddingHallSchema = new mongoose.Schema(
  {
    // ---------- Hall Identity ----------
    name: {
      type: String,
      required: [true, 'Hall name is required'],
      unique: true,
      trim: true,
      // Example: "Grand Ballroom", "Garden Pavilion"
    },

    description: {
      type: String,
      trim: true,
    },

    // ---------- Capacity & Pricing ----------
    capacity: {
      type: Number,
      required: [true, 'Hall capacity is required'],
      min: [10, 'Capacity must be at least 10'],
    },

    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [0, 'Price cannot be negative'],
    },

    // ---------- Location ----------
    location: {
      type: String,
      trim: true,
      // Example: "Ground Floor - East Wing"
    },

    // ---------- Available Services ----------
    // Services included in the package
    services: {
      type: [String],
      default: [],
      // Example: ['Decoration', 'Catering', 'Photography', 'DJ', 'Lighting']
    },

    // ---------- Media ----------
    images: {
      type: [String],
      default: [],
    },

    // ---------- Availability ----------
    isAvailable: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WeddingHall', weddingHallSchema);
