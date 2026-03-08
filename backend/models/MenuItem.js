// ============================================
// models/MenuItem.js — Menu Item Collection Schema
// ============================================
//
// THIS COLLECTION STORES:
//   All restaurant menu items — food and beverages available for ordering.
//
// WHO USES IT:
//   - Customers: Browse the menu and place orders
//   - Admin: Add, edit, delete menu items
//   - Cashier: Select items when creating POS orders

const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    // ---------- Item Details ----------
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // ---------- Pricing ----------
    price: {
      type: Number,
      required: [true, 'Item price is required'],
      min: [0, 'Price cannot be negative'],
    },

    // ---------- Category ----------
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['appetizer', 'main-course', 'dessert', 'beverage', 'snack'],
    },

    // ---------- Media ----------
    image: {
      type: String,          // Single image URL for the menu item
      default: '',
    },

    // ---------- Availability ----------
    isAvailable: {
      type: Boolean,
      default: true,         // Can be toggled off when item is out of stock
    },

    // ---------- Extra Info ----------
    preparationTime: {
      type: Number,          // Estimated time in minutes
      default: 15,
    },

    isVegetarian: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,         // Admin can soft-delete items
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
