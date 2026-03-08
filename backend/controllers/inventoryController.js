// ============================================
// controllers/inventoryController.js — Inventory Management
// ============================================
//
// Tracks hotel stock — kitchen supplies, cleaning materials, toiletries, etc.
// Inventory has auto stock-status via a pre-save hook in the model:
//   quantity > minimumStock  → 'in-stock'
//   quantity <= minimumStock → 'low-stock'
//   quantity <= 0            → 'out-of-stock'

const Inventory = require('../models/Inventory');

// ============================================
// @desc    Get all inventory items
// @route   GET /api/inventory
// @query   ?category=kitchen&stockStatus=low-stock
// @access  Private (Staff, Admin)
// ============================================
const getAllInventory = async (req, res, next) => {
  try {
    const filter = { isActive: true };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.stockStatus) filter.stockStatus = req.query.stockStatus;

    const items = await Inventory.find(filter).sort('category name');

    // Count items by status for a quick summary
    const summary = {
      total: items.length,
      inStock: items.filter((i) => i.stockStatus === 'in-stock').length,
      lowStock: items.filter((i) => i.stockStatus === 'low-stock').length,
      outOfStock: items.filter((i) => i.stockStatus === 'out-of-stock').length,
    };

    res.json({
      success: true,
      summary,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private (Staff, Admin)
// ============================================
const getInventoryItemById = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }
    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Add new inventory item
// @route   POST /api/inventory
// @access  Private/Admin
// ============================================
const createInventoryItem = async (req, res, next) => {
  try {
    const { name, description, category, quantity, unit, minimumStock, unitPrice, supplier } = req.body;

    const item = await Inventory.create({
      name,
      description,
      category,
      quantity: quantity || 0,
      unit,
      minimumStock: minimumStock || 10,
      unitPrice: unitPrice || 0,
      supplier: supplier || '',
      lastRestocked: quantity > 0 ? new Date() : undefined,
    });

    res.status(201).json({
      success: true,
      message: `Inventory item "${name}" added`,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Update inventory item details
// @route   PUT /api/inventory/:id
// @access  Private/Admin
// ============================================
const updateInventoryItem = async (req, res, next) => {
  try {
    let item = await Inventory.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }

    // Use save() instead of findByIdAndUpdate so the pre-save hook runs
    // (to auto-update stockStatus)
    Object.keys(req.body).forEach((key) => {
      item[key] = req.body[key];
    });
    await item.save();

    res.json({
      success: true,
      message: `"${item.name}" updated`,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Restock an inventory item (add quantity)
// @route   PUT /api/inventory/:id/restock
// @access  Private/Admin
//
// REQUEST BODY: { "quantity": 50 }
// This ADDS to the existing quantity, doesn't replace it.
// ============================================
const restockItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      res.status(400);
      throw new Error('Please provide a positive quantity to add');
    }

    const item = await Inventory.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }

    const oldQuantity = item.quantity;
    item.quantity += quantity;
    item.lastRestocked = new Date();
    await item.save(); // Pre-save hook will update stockStatus

    res.json({
      success: true,
      message: `"${item.name}" restocked: ${oldQuantity} → ${item.quantity} ${item.unit}`,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Use/consume inventory (subtract quantity)
// @route   PUT /api/inventory/:id/use
// @access  Private (Staff, Admin)
//
// REQUEST BODY: { "quantity": 5 }
// This SUBTRACTS from the existing quantity.
// ============================================
const useItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      res.status(400);
      throw new Error('Please provide a positive quantity to use');
    }

    const item = await Inventory.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }

    if (quantity > item.quantity) {
      res.status(400);
      throw new Error(
        `Not enough stock. Available: ${item.quantity} ${item.unit}, requested: ${quantity}`
      );
    }

    const oldQuantity = item.quantity;
    item.quantity -= quantity;
    await item.save(); // Pre-save hook will update stockStatus

    res.json({
      success: true,
      message: `"${item.name}" used: ${oldQuantity} → ${item.quantity} ${item.unit}`,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Delete inventory item (soft delete)
// @route   DELETE /api/inventory/:id
// @access  Private/Admin
// ============================================
const deleteInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }

    item.isActive = false;
    await item.save();

    res.json({
      success: true,
      message: `"${item.name}" removed from inventory`,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get low stock alerts
// @route   GET /api/inventory/alerts
// @access  Private (Staff, Admin)
// ============================================
const getLowStockAlerts = async (req, res, next) => {
  try {
    const alerts = await Inventory.find({
      isActive: true,
      stockStatus: { $in: ['low-stock', 'out-of-stock'] },
    }).sort('stockStatus quantity');

    res.json({
      success: true,
      count: alerts.length,
      message: alerts.length > 0
        ? `${alerts.length} item(s) need attention`
        : 'All items are well stocked',
      alerts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInventory,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  restockItem,
  useItem,
  deleteInventoryItem,
  getLowStockAlerts,
};
