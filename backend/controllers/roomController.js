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
//
// HOW FILTERING WORKS (getAllRooms):
//   Customers can filter rooms using URL query parameters:
//     GET /api/rooms?type=double             → only double rooms
//     GET /api/rooms?status=available        → only available rooms
//     GET /api/rooms?minPrice=5000&maxPrice=15000 → rooms in price range
//     GET /api/rooms?capacity=2             → rooms fitting 2+ guests
//   These filters are combined with AND logic.

const Room = require('../models/Room');

// ============================================
// @desc    Get all rooms (with optional filters)
// @route   GET /api/rooms
// @access  Public
// ============================================
const getAllRooms = async (req, res, next) => {
  try {
    // ---------- Build filter object ----------
    // Start with only active rooms
    const filter = { isActive: true };

    // Filter by room type (single, double, twin, suite, family)
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Filter by status (available, occupied, maintenance, reserved)
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by price range
    // MongoDB uses $gte (>=) and $lte (<=) operators
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = Number(req.query.minPrice); // greater than or equal
      }
      if (req.query.maxPrice) {
        filter.price.$lte = Number(req.query.maxPrice); // less than or equal
      }
    }

    // Filter by minimum capacity
    if (req.query.capacity) {
      filter.capacity = { $gte: Number(req.query.capacity) };
    }

    // Filter by floor
    if (req.query.floor) {
      filter.floor = Number(req.query.floor);
    }

    // ---------- Execute query ----------
    // .sort('roomNumber') orders rooms by room number (101, 102, 103...)
    const rooms = await Room.find(filter).sort('roomNumber');

    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
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

    res.json({
      success: true,
      room,
    });
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

    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      res.status(400);
      throw new Error(`Room number ${roomNumber} already exists`);
    }

    // Create the room
    const room = await Room.create({
      roomNumber,
      type,
      description,
      price,
      capacity,
      amenities: amenities || [],
      images: images || [],
      floor: floor || 1,
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
// ============================================
const updateRoom = async (req, res, next) => {
  try {
    // Check if room exists
    let room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    // If changing room number, check it's not already taken
    if (req.body.roomNumber && req.body.roomNumber !== room.roomNumber) {
      const duplicate = await Room.findOne({ roomNumber: req.body.roomNumber });
      if (duplicate) {
        res.status(400);
        throw new Error(`Room number ${req.body.roomNumber} already exists`);
      }
    }

    // Update only the fields that were sent in the request
    // findByIdAndUpdate replaces only the provided fields
    room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,            // Return the updated document
        runValidators: true,  // Run schema validations
      }
    );

    res.json({
      success: true,
      message: `Room ${room.roomNumber} updated successfully`,
      room,
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

    // Soft delete — set isActive to false
    // The room data is preserved for historical bookings
    // but it won't show up in public room listings (filtered by isActive: true)
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
//
// STATUS OPTIONS:
//   available   → Room is ready for guests
//   occupied    → Guest is currently staying
//   maintenance → Room is being cleaned or repaired
//   reserved    → Room is booked but guest hasn't arrived
//
// TYPICAL STATUS FLOW:
//   available → reserved (booking made)
//   reserved  → occupied (guest checks in)
//   occupied  → maintenance (guest checks out, room needs cleaning)
//   maintenance → available (cleaning done)
// ============================================
const changeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate the status value
    const validStatuses = ['available', 'occupied', 'maintenance', 'reserved'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400);
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      );
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    // Save the old status for the response message
    const oldStatus = room.status;

    // Update the status
    room.status = status;
    await room.save();

    res.json({
      success: true,
      message: `Room ${room.roomNumber} status changed: ${oldStatus} → ${status}`,
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
    // MongoDB aggregation pipeline — a powerful way to compute stats
    // Think of it as SQL GROUP BY but more flexible
    //
    // What this does:
    //   1. Only look at active rooms
    //   2. Group rooms by status
    //   3. Count how many rooms are in each status
    const statusStats = await Room.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get type breakdown
    const typeStats = await Room.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
        },
      },
    ]);

    // Total counts
    const totalRooms = await Room.countDocuments({ isActive: true });
    const availableRooms = await Room.countDocuments({ isActive: true, status: 'available' });

    res.json({
      success: true,
      stats: {
        totalRooms,
        availableRooms,
        occupancyRate: totalRooms > 0
          ? (((totalRooms - availableRooms) / totalRooms) * 100).toFixed(1) + '%'
          : '0%',
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
