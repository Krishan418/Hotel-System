// ============================================
// controllers/roomController.js — Room Management Logic
// ============================================
//
// This controller handles all room-related operations:
//
//   PUBLIC:
//     getAllRooms    — Browse all active rooms (with filters)
//     getRoomById   — View a single room's details
//
//   ADMIN ONLY:
//     createRoom    — Add a new room to the hotel
//     updateRoom    — Edit room details (price, amenities, etc.)
//     deleteRoom    — Soft-delete a room (set isActive = false)
//     changeStatus  — Change room status (available/occupied/maintenance/reserved)
//     getRoomStats  — Statistics for the admin dashboard

const Room = require('../models/Room');

// ============================================
// @desc    Get all rooms (with optional filters)
// @route   GET /api/rooms
// @access  Public
// ============================================
const getAllRooms = async (req, res, next) => {
  try {
    const filter = { isActive: true };

    // Filter by room type
    const validTypes = ['single', 'double', 'twin', 'suite', 'family'];
    if (req.query.type && validTypes.includes(req.query.type)) {
      filter.type = req.query.type;
    }

    // Filter by status
    const validStatuses = ['available', 'occupied', 'maintenance', 'reserved'];
    if (req.query.status && validStatuses.includes(req.query.status)) {
      filter.status = req.query.status;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // Filter by minimum capacity
    if (req.query.capacity) {
      filter.capacity = { $gte: Number(req.query.capacity) };
    }

    // Filter by floor
    if (req.query.floor) {
      filter.floor = Number(req.query.floor);
    }

    const rooms = await Room.find(filter).sort('roomNumber');

    res.json({ success: true, count: rooms.length, rooms });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
// ============================================
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    res.json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private/Admin
// ============================================
const createRoom = async (req, res, next) => {
  try {
    const { roomNumber, type, description, price, capacity, amenities, images, floor } = req.body;

    // Validate required fields explicitly for a clear error message
    if (!roomNumber || !type || !price || !capacity) {
      res.status(400);
      throw new Error('Room number, type, price, and capacity are required');
    }

    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      res.status(400);
      throw new Error(`Room number "${roomNumber}" already exists`);
    }

    const room = await Room.create({
      roomNumber,
      type,
      description,
      price: Number(price),
      capacity: Number(capacity),
      amenities: amenities || [],
      images: images || [],
      floor: floor ? Number(floor) : 1,
    });

    res.status(201).json({
      success: true,
      message: `Room ${roomNumber} created successfully`,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Private/Admin
//
// BUG FIX: Previously used req.body directly, allowing any field
// (including status, isActive) to be updated without validation.
// Now only editable fields are whitelisted.
// ============================================
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    // If changing room number, check it's not already taken
    if (req.body.roomNumber && req.body.roomNumber !== room.roomNumber) {
      const duplicate = await Room.findOne({ roomNumber: req.body.roomNumber });
      if (duplicate) {
        res.status(400);
        throw new Error(`Room number "${req.body.roomNumber}" already exists`);
      }
    }

    // ── Whitelist of updatable fields ──
    // Only these fields can be changed via this endpoint.
    // Status changes go through PUT /api/rooms/:id/status
    // Soft-deletes go through DELETE /api/rooms/:id
    const allowedUpdates = {};
    const allowed = ['roomNumber', 'type', 'description', 'price', 'capacity', 'amenities', 'images', 'floor'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        allowedUpdates[field] = req.body[field];
      }
    });

    if (Object.keys(allowedUpdates).length === 0) {
      res.status(400);
      throw new Error('No valid fields provided for update');
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: `Room ${updatedRoom.roomNumber} updated successfully`,
      room: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Delete room (soft delete)
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
// ============================================
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    // Prevent deleting a room that is currently occupied
    if (room.status === 'occupied') {
      res.status(400);
      throw new Error('Cannot delete a room that is currently occupied. Check out the guest first.');
    }

    // Soft delete — preserves historical booking data
    room.isActive = false;
    await room.save();

    res.json({
      success: true,
      message: `Room ${room.roomNumber} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Change room status
// @route   PUT /api/rooms/:id/status
// @access  Private/Admin, Staff
// ============================================
const changeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['available', 'occupied', 'maintenance', 'reserved'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status. Choose from: ${validStatuses.join(', ')}`);
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    const oldStatus = room.status;
    room.status = status;
    await room.save();

    res.json({
      success: true,
      message: `Room ${room.roomNumber}: ${oldStatus} → ${status}`,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get room statistics (for admin dashboard)
// @route   GET /api/rooms/stats
// @access  Private/Admin
// ============================================
const getRoomStats = async (req, res, next) => {
  try {
    const statusStats = await Room.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const typeStats = await Room.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
    ]);

    const totalRooms     = await Room.countDocuments({ isActive: true });
    const availableRooms = await Room.countDocuments({ isActive: true, status: 'available' });
    const occupiedRooms  = await Room.countDocuments({ isActive: true, status: 'occupied' });

    res.json({
      success: true,
      stats: {
        total: totalRooms,
        available: availableRooms,
        occupied: occupiedRooms,
        maintenance: await Room.countDocuments({ isActive: true, status: 'maintenance' }),
        reserved: await Room.countDocuments({ isActive: true, status: 'reserved' }),
        occupancyRate: totalRooms > 0
          ? Number(((occupiedRooms / totalRooms) * 100).toFixed(1))
          : 0,
        byStatus: statusStats,
        byType: typeStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  changeStatus,
  getRoomStats,
};
