// ============================================
// routes/userRoutes.js — User Management Routes (Admin)
// ============================================
//
// All routes here are protected by:
//   1. auth middleware → must be logged in
//   2. roleCheck('admin') → must have admin role
//
// This means ONLY admins can access these endpoints.

const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Apply BOTH middleware to ALL routes in this file
// This is a shortcut instead of writing auth, roleCheck('admin') on every route
router.use(auth);
router.use(roleCheck('admin'));

// @route   GET /api/users         → Get all users
// @route   POST /api/users        → Create new user (any role)
router.route('/').get(getAllUsers).post(createUser);

// @route   GET /api/users/:id     → Get single user
// @route   PUT /api/users/:id     → Update user
// @route   DELETE /api/users/:id  → Delete (deactivate) user
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
