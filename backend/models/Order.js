// ============================================
// models/Order.js — Food Order Collection Schema
// ============================================
//
// THIS COLLECTION STORES:
//   All food orders — from customers, POS, room service.
//
// RELATIONSHIPS:
//   - Each order belongs to ONE user (who placed it)
//   - Each order contains MULTIPLE menu items (embedded subdocument array)
//   - Each order may be linked to a delivery
//
// EMBEDDED vs REFERENCED:
//   Here we EMBED order items (store them directly inside the order)
//   instead of referencing them. Why?
//   - Order items are only meaningful within this order
//   - We want to preserve the price at time of ordering
//     (menu prices might change later!)
//   - We rarely need to query order items independently

const mongoose = require('mongoose');

// ---------- Sub-schema for order items ----------
// This is not a separate collection — it's embedded inside each order
const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: {
      type: String,
      required: true,        // Store the name at time of ordering
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: true,        // Store the price at time of ordering
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: false }             // Don't create separate _ids for sub-items
);

// ---------- Main Order Schema ----------
const orderSchema = new mongoose.Schema(
  {
    // ---------- Who ordered ----------
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },

    // ---------- What was ordered ----------
    items: {
      type: [orderItemSchema],
      required: [true, 'Order must have at least one item'],
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },

    // ---------- Order Type ----------
    orderType: {
      type: String,
      enum: ['dine-in', 'takeaway', 'room-service', 'delivery'],
      default: 'dine-in',
    },

    // ---------- Pricing ----------
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },

    tax: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },

    // ---------- Status ----------
    status: {
      type: String,
      enum: ['placed', 'preparing', 'ready', 'served', 'delivered', 'cancelled'],
      default: 'placed',
      //
      // STATUS FLOW:
      //   placed    → Order is received
      //   preparing → Kitchen is making the food
      //   ready     → Food is ready for pickup/serving
      //   served    → Dine-in/room-service delivered to table/room
      //   delivered → Delivery order has been delivered
      //   cancelled → Order was cancelled
    },

    // ---------- Delivery Info ----------
    // Only filled if orderType is 'delivery'
    deliveryAddress: {
      type: String,
      trim: true,
    },

    // ---------- Room Service Info ----------
    // Only filled if orderType is 'room-service'
    roomNumber: {
      type: String,
      trim: true,
    },

    // ---------- Table Number ----------
    // Only filled if orderType is 'dine-in'
    tableNumber: {
      type: String,
      trim: true,
    },

    // ---------- Notes ----------
    notes: {
      type: String,
      trim: true,
      // Example: "No onions, extra spicy"
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

module.exports = mongoose.model('Order', orderSchema);
