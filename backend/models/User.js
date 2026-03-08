// ============================================
// models/User.js — User Collection Schema
// ============================================
//
// WHAT IS A SCHEMA?
//   A schema defines the SHAPE of documents in a MongoDB collection.
//   Think of it as a blueprint — it says what fields each document
//   must have, what type of data each field holds, and any rules.
//
// WHAT IS A MODEL?
//   A model is a JavaScript class built from the schema.
//   It gives us methods to create, read, update, and delete documents.
//   Example: User.find(), User.create(), User.findById()
//
// THIS COLLECTION STORES:
//   All system users — customers, staff, admin, cashier, delivery persons.
//   The "role" field determines what they can access.

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    // ---------- Basic Info ----------
    name: {
      type: String,          // Text data
      required: [true, 'Please provide your name'],  // Must be filled
      trim: true,            // Removes extra spaces: "  John  " → "John"
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,          // No two users can have the same email
      lowercase: true,       // Converts to lowercase: "John@Mail.com" → "john@mail.com"
      trim: true,
      match: [              // Must match this pattern (basic email format)
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,         // IMPORTANT: password won't be included in query results
                             // You must explicitly ask for it: User.findById(id).select('+password')
    },

    phone: {
      type: String,
      trim: true,
    },

    // ---------- Role ----------
    // This determines what the user can do in the system
    role: {
      type: String,
      enum: ['customer', 'admin', 'staff', 'cashier', 'delivery'],  // Only these values allowed
      default: 'customer',   // New users are customers by default
    },

    // ---------- Profile ----------
    address: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,         // Accounts are active by default
    },
  },
  {
    // ---------- Schema Options ----------
    timestamps: true,        // Automatically adds createdAt and updatedAt fields
    //
    // WHAT timestamps DOES:
    //   MongoDB automatically tracks:
    //   - createdAt: when the document was first created
    //   - updatedAt: when the document was last modified
    //   You don't need to manage these manually!
  }
);

// ============================================
// PRE-SAVE HOOK — Runs BEFORE saving a user
// ============================================
// This automatically hashes the password before storing it.
//
// WHY?
//   We NEVER store plain-text passwords. If the database is
//   compromised, hackers can't read the passwords.
//
// WHEN DOES IT RUN?
//   - When creating a new user (User.create())
//   - When updating a user IF the password field was changed
//
// "pre" means "before" — this runs before the save operation.

userSchema.pre('save', async function (next) {
  // Only hash the password if it was changed (or is new)
  // This prevents re-hashing an already-hashed password
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a salt (random data added to the password before hashing)
  // 10 = number of rounds (higher = more secure but slower)
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// ============================================
// INSTANCE METHOD — Compare passwords
// ============================================
// This method is available on every user document.
// Usage: const isMatch = await user.comparePassword('inputPassword');
//
// HOW IT WORKS:
//   bcrypt.compare() takes the plain-text password the user typed,
//   hashes it the same way, and compares it to the stored hash.
//   It returns true if they match, false if they don't.

userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// Create and export the model
// "User" = model name, userSchema = the schema to use
// MongoDB will create a collection called "users" (lowercase, plural)
module.exports = mongoose.model('User', userSchema);
