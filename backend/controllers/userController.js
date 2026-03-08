// ============================================
// controllers/userController.js — User Management (Admin)
// ============================================
//
// These functions let admins manage all users in the system.
// Only admins should have access to these routes.
//
// WHAT ADMINS CAN DO:
//   - View all users (with filtering by role)
//   - View a single user's details
//   - Update a user (change role, deactivate)
//   - Create users with any role (staff, cashier, delivery person)
//   - Delete a user (soft delete — sets isActive to false)

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ============================================
// @desc    Get all users (with optional role filter)
// @route   GET /api/users
// @route   GET /api/users?role=staff
// @access  Private/Admin
// ============================================
const getAllUsers = async (req, res, next) => {
  try {
    // Build filter object from query parameters
    // Example: GET /api/users?role=staff → { role: 'staff' }
    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Find all users matching the filter
    // .select('-password') ensures password is never sent
    // .sort('-createdAt') shows newest users first
    const users = await User.find(filter)
      .select('-password')
      .sort('-createdAt');

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
// ============================================
const getUserById = async (req, res, next) => {
  try {
    // req.params.id comes from the URL: /api/users/507f1f77bcf86cd799439011
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Admin creates a new user (any role)
// @route   POST /api/users
// @access  Private/Admin
// ============================================
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('A user with this email already exists');
    }

    // Admin can assign any role
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'customer',
    });

    res.status(201).json({
      success: true,
      message: `${role || 'customer'} account created successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Update user (role, active status, etc.)
// @route   PUT /api/users/:id
// @access  Private/Admin
// ============================================
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Fields that admin can update
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.body.role) updates.role = req.body.role;
    if (req.body.address) updates.address = req.body.address;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Delete user (soft delete — deactivate)
// @route   DELETE /api/users/:id
// @access  Private/Admin
// ============================================
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot delete your own account');
    }

    // Soft delete — just deactivate instead of removing from database
    // This preserves data integrity (bookings, orders, etc. still reference this user)
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
