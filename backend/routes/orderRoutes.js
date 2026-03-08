// ============================================
// routes/orderRoutes.js — Food Order & POS Routes
// ============================================

const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} = require('../controllers/orderController');

const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All order routes require login
router.use(auth);

// Stats (static route BEFORE :id)
router.get('/stats', roleCheck('admin'), getOrderStats);

// List & Create
router.get('/', getAllOrders);
router.post('/', roleCheck('customer', 'cashier', 'admin'), createOrder);

// Single order
router.get('/:id', getOrderById);

// Status management (Staff, Cashier, Admin)
router.put('/:id/status', roleCheck('staff', 'cashier', 'admin'), updateOrderStatus);

// Cancel (Customer — own, Cashier/Admin — any)
router.put('/:id/cancel', cancelOrder);

module.exports = router;
