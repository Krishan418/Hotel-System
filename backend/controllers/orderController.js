// ============================================
// controllers/orderController.js — Food Order & POS Logic
// ============================================
//
// ORDER FLOW:
//   ┌──────────┐     ┌────────┐     ┌───────────┐     ┌─────────┐
//   │  placed   │────>│preparing│────>│   ready   │────>│ served/ │
//   │  (new)    │     │(kitchen)│     │(pick up)  │     │delivered│
//   └──────────┘     └────────┘     └───────────┘     └─────────┘
//        │
//        ▼
//   ┌──────────┐
//   │cancelled │
//   └──────────┘
//
// WHO CREATES ORDERS:
//   - Customer: dine-in, takeaway, room-service, delivery (via app)
//   - Cashier: POS orders (creates order for walk-in customers)
//
// POS (Point of Sale):
//   The cashier creates orders directly at the counter.
//   Same endpoint, but the cashier can set orderType and mark as paid.

const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// ============================================
// @desc    Create a new food order
// @route   POST /api/orders
// @access  Private (Customer, Cashier, Admin)
//
// REQUEST BODY:
//   {
//     "items": [
//       { "menuItem": "507f1f77...", "quantity": 2 },
//       { "menuItem": "507f1f78...", "quantity": 1 }
//     ],
//     "orderType": "dine-in",
//     "tableNumber": "T5",
//     "notes": "No onions"
//   }
//
// WHAT HAPPENS:
//   1. Validate all menu items exist and are available
//   2. Look up current prices (never trust client-sent prices!)
//   3. Calculate subtotal, tax, and total
//   4. Create the order with embedded item details
// ============================================
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      orderType,
      tableNumber,
      roomNumber,
      deliveryAddress,
      notes,
    } = req.body;

    // ---------- Validate items ----------
    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('Order must have at least one item');
    }

    // ---------- Look up each menu item and build order items ----------
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      // Find the menu item in the database
      const menuItem = await MenuItem.findById(item.menuItem);

      if (!menuItem) {
        res.status(404);
        throw new Error(`Menu item not found: ${item.menuItem}`);
      }

      if (!menuItem.isAvailable) {
        res.status(400);
        throw new Error(`"${menuItem.name}" is currently unavailable`);
      }

      if (!menuItem.isActive) {
        res.status(400);
        throw new Error(`"${menuItem.name}" is no longer on the menu`);
      }

      // Build the embedded order item
      // We store name and price at ORDER TIME so they're preserved
      // even if the menu item changes later
      const orderItem = {
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity || 1,
        price: menuItem.price,
      };

      orderItems.push(orderItem);
      subtotal += orderItem.price * orderItem.quantity;
    }

    // ---------- Calculate pricing ----------
    const taxRate = 0.10; // 10% tax
    const tax = Math.round(subtotal * taxRate);
    const totalPrice = subtotal + tax;

    // ---------- Create order ----------
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      orderType: orderType || 'dine-in',
      subtotal,
      tax,
      totalPrice,
      tableNumber: tableNumber || '',
      roomNumber: roomNumber || '',
      deliveryAddress: deliveryAddress || '',
      notes: notes || '',
      status: 'placed',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get all orders (role-filtered)
// @route   GET /api/orders
// @query   ?status=preparing&orderType=dine-in
// @access  Private
//
// ROLE FILTERING:
//   Customer → sees only their orders
//   Cashier  → sees all orders (for POS management)
//   Staff    → sees all orders
//   Admin    → sees all orders
// ============================================
const getAllOrders = async (req, res, next) => {
  try {
    let filter = {};

    // Customers see only their own orders
    if (req.user.role === 'customer') {
      filter.user = req.user._id;
    }

    if (req.query.status) filter.status = req.query.status;
    if (req.query.orderType) filter.orderType = req.query.orderType;

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort('-createdAt');

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
// ============================================
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Customers can only view their own
    if (
      req.user.role === 'customer' &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('You can only view your own orders');
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Update order status (kitchen workflow)
// @route   PUT /api/orders/:id/status
// @access  Private (Staff, Cashier, Admin)
//
// STATUS FLOW:
//   placed → preparing → ready → served/delivered
//   placed → cancelled
// ============================================
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['placed', 'preparing', 'ready', 'served', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Prevent going backwards in the flow
    const statusOrder = ['placed', 'preparing', 'ready', 'served', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.status);
    const newIndex = statusOrder.indexOf(status);

    if (status !== 'cancelled' && newIndex <= currentIndex && order.status !== 'cancelled') {
      res.status(400);
      throw new Error(`Cannot change status from "${order.status}" to "${status}"`);
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: `Order status: ${oldStatus} → ${status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private (Customer — own, Cashier/Admin — any)
// ============================================
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (req.user.role === 'customer' &&
        order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You can only cancel your own orders');
    }

    // Can only cancel if not yet served/delivered
    if (['served', 'delivered', 'cancelled'].includes(order.status)) {
      res.status(400);
      throw new Error(`Cannot cancel order with status "${order.status}"`);
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get order statistics (for dashboard)
// @route   GET /api/orders/stats
// @access  Private/Admin
// ============================================
const getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const activeOrders = await Order.countDocuments({
      status: { $in: ['placed', 'preparing', 'ready'] },
    });

    // Revenue from completed orders
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['served', 'delivered'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);

    // Orders by type
    const byType = await Order.aggregate([
      { $group: { _id: '$orderType', count: { $sum: 1 } } },
    ]);

    // Orders by status
    const byStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        activeOrders,
        totalRevenue: revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0,
        byType,
        byStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
};
