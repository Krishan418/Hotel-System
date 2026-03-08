// ============================================
// controllers/menuController.js — Menu Item Management
// ============================================
//
// MENU MANAGEMENT:
//   - Public: Browse menu items with category filters
//   - Admin: CRUD operations + toggle availability
//
// CATEGORIES: appetizer, main-course, dessert, beverage, snack

const MenuItem = require('../models/MenuItem');

// ============================================
// @desc    Get all menu items (with filters)
// @route   GET /api/menu
// @query   ?category=main-course&vegetarian=true&available=true
// @access  Public
// ============================================
const getAllMenuItems = async (req, res, next) => {
  try {
    const filter = { isActive: true };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.vegetarian === 'true') filter.isVegetarian = true;
    if (req.query.available !== undefined) {
      filter.isAvailable = req.query.available === 'true';
    }

    const menuItems = await MenuItem.find(filter).sort('category name');

    // Group items by category for a cleaner response
    const grouped = {};
    menuItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    res.json({
      success: true,
      count: menuItems.length,
      menuItems,
      menuByCategory: grouped,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
// ============================================
const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }
    res.json({ success: true, menuItem: item });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Create menu item
// @route   POST /api/menu
// @access  Private/Admin
// ============================================
const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, image, preparationTime, isVegetarian } = req.body;

    const item = await MenuItem.create({
      name,
      description,
      price,
      category,
      image: image || '',
      preparationTime: preparationTime || 15,
      isVegetarian: isVegetarian || false,
    });

    res.status(201).json({
      success: true,
      message: `Menu item "${name}" created`,
      menuItem: item,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
// ============================================
const updateMenuItem = async (req, res, next) => {
  try {
    let item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }

    item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: `Menu item "${item.name}" updated`,
      menuItem: item,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Delete menu item (soft delete)
// @route   DELETE /api/menu/:id
// @access  Private/Admin
// ============================================
const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }

    item.isActive = false;
    await item.save();

    res.json({
      success: true,
      message: `Menu item "${item.name}" deleted`,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Toggle item availability (in stock / out of stock)
// @route   PUT /api/menu/:id/availability
// @access  Private/Admin
// ============================================
const toggleAvailability = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json({
      success: true,
      message: `"${item.name}" is now ${item.isAvailable ? 'available' : 'unavailable'}`,
      menuItem: item,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
};
