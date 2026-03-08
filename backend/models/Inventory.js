// ============================================
// models/Inventory.js — Inventory Collection Schema
// ============================================
//
// THIS COLLECTION STORES:
//   Hotel inventory items — kitchen supplies, cleaning materials,
//   toiletries, and other stock items.
//
// WHO USES IT:
//   - Admin: Track stock levels, add new items
//   - Staff: Report low stock items
//
// WHY TRACK INVENTORY?
//   Prevents running out of essential items (food ingredients,
//   toiletries for rooms, cleaning supplies, etc.)

const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
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

    // ---------- Category ----------
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['kitchen', 'housekeeping', 'toiletries', 'maintenance', 'office', 'other'],
    },

    // ---------- Stock ----------
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },

    unit: {
      type: String,
      required: [true, 'Unit is required'],
      // Example: 'kg', 'liters', 'pieces', 'boxes', 'packets'
    },

    // ---------- Thresholds ----------
    minimumStock: {
      type: Number,
      default: 10,
      // Alert when quantity drops below this number
    },

    // ---------- Pricing ----------
    unitPrice: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },

    // ---------- Supplier ----------
    supplier: {
      type: String,
      trim: true,
    },

    // ---------- Status ----------
    // Automatically computed based on quantity vs minimumStock
    // But we store it for easy querying
    stockStatus: {
      type: String,
      enum: ['in-stock', 'low-stock', 'out-of-stock'],
      default: 'in-stock',
    },

    lastRestocked: {
      type: Date,
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

// ============================================
// PRE-SAVE HOOK — Auto-update stockStatus
// ============================================
// Automatically sets stockStatus based on current quantity
inventorySchema.pre('save', function (next) {
  if (this.quantity <= 0) {
    this.stockStatus = 'out-of-stock';
  } else if (this.quantity <= this.minimumStock) {
    this.stockStatus = 'low-stock';
  } else {
    this.stockStatus = 'in-stock';
  }
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
