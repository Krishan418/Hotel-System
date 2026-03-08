// ============================================
// routes/inventoryRoutes.js — Inventory Management Routes
// ============================================

const express = require('express');
const router = express.Router();

const {
  getAllInventory,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  restockItem,
  useItem,
  deleteInventoryItem,
  getLowStockAlerts,
} = require('../controllers/inventoryController');

const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All inventory routes require login
router.use(auth);

// Static routes BEFORE :id
router.get('/alerts', roleCheck('staff', 'admin'), getLowStockAlerts);

// List & Create
router.get('/', roleCheck('staff', 'admin'), getAllInventory);
router.post('/', roleCheck('admin'), createInventoryItem);

// Single item
router.get('/:id', roleCheck('staff', 'admin'), getInventoryItemById);
router.put('/:id', roleCheck('admin'), updateInventoryItem);
router.delete('/:id', roleCheck('admin'), deleteInventoryItem);

// Stock operations
router.put('/:id/restock', roleCheck('admin'), restockItem);
router.put('/:id/use', roleCheck('staff', 'admin'), useItem);

module.exports = router;
