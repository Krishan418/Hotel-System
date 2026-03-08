// ============================================
// routes/menuRoutes.js — Menu Management Routes
// ============================================

const express = require('express');
const router = express.Router();

const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} = require('../controllers/menuController');

const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// PUBLIC
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);

// ADMIN ONLY
router.post('/', auth, roleCheck('admin'), createMenuItem);
router.put('/:id', auth, roleCheck('admin'), updateMenuItem);
router.delete('/:id', auth, roleCheck('admin'), deleteMenuItem);
router.put('/:id/availability', auth, roleCheck('admin'), toggleAvailability);

module.exports = router;
