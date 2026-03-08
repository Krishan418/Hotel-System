// ============================================
// models/Payment.js — Payment Collection Schema
// ============================================
//
// THIS COLLECTION STORES:
//   All payments across the system — for rooms, weddings,
//   food orders, and pool bookings.
//
// WHY A SINGLE PAYMENT COLLECTION?
//   Instead of having separate payment fields in each booking,
//   we centralize all payments here. This makes it easy to:
//   - Generate financial reports
//   - Track revenue by category
//   - Manage refunds
//   - Print receipts
//
// RELATIONSHIPS:
//   - Each payment belongs to ONE user (who paid)
//   - Each payment links to the thing they paid for (room booking, order, etc.)
//   - We use "paymentFor" + "referenceId" to create a flexible link

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    // ---------- Who paid ----------
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },

    // ---------- What was paid for ----------
    // Instead of separate fields for each type, we use a flexible approach:
    // paymentFor tells us the TYPE, referenceId tells us WHICH document
    paymentFor: {
      type: String,
      required: [true, 'Payment type is required'],
      enum: ['room-booking', 'wedding-booking', 'food-order', 'pool-booking'],
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Reference ID is required'],
      // This ID points to the specific booking/order document
      // We can't use "ref" here because it could point to different collections
    },

    // ---------- Amount ----------
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },

    // ---------- Payment Method ----------
    method: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['cash', 'card', 'bank-transfer'],
    },

    // ---------- Status ----------
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },

    // ---------- Receipt ----------
    receiptNumber: {
      type: String,
      unique: true,
      // Auto-generated before saving (see pre-save hook below)
    },

    // ---------- Notes ----------
    notes: {
      type: String,
      trim: true,
    },

    // ---------- Processed By ----------
    // Which cashier/staff processed the payment
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// PRE-SAVE HOOK — Generate receipt number
// ============================================
// Creates a unique receipt number like: RCP-20260308-ABC123
paymentSchema.pre('save', function (next) {
  if (!this.receiptNumber) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.receiptNumber = `RCP-${date}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
