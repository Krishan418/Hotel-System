// ============================================
// controllers/bookingController.js — Room Booking Logic
// ============================================
//
// THE BOOKING LIFECYCLE:
//
//   ┌──────────┐     ┌───────────┐     ┌───────────┐     ┌─────────────┐
//   │ Customer  │     │  Pending   │     │ Confirmed │     │ Checked-In  │
//   │ searches  │────>│  booking   │────>│  booking  │────>│   (guest    │
//   │ rooms     │     │  created   │     │           │     │  is staying)│
//   └──────────┘     └───────────┘     └───────────┘     └──────┬──────┘
//                          │                                      │
//                          ▼                                      ▼
//                    ┌───────────┐                         ┌─────────────┐
//                    │ Cancelled │                         │ Checked-Out │
//                    └───────────┘                         └─────────────┘
//
// AUTOMATIC ROOM STATUS UPDATES:
//   When booking confirmed → Room status = 'reserved'
//   When guest checks in   → Room status = 'occupied'
//   When guest checks out  → Room status = 'available'
//   When booking cancelled → Room status = 'available' (if it was reserved)
//
// STAY DURATION CALCULATION:
//   Duration = (checkOut date - checkIn date) in days
//   Total Price = duration × room price per night

const RoomBooking = require('../models/RoomBooking');
const Room = require('../models/Room');

// ============================================
// @desc    Search available rooms for given dates
// @route   GET /api/bookings/available
// @query   ?checkIn=2026-03-15&checkOut=2026-03-18&type=double&capacity=2
// @access  Public
//
// HOW AVAILABILITY SEARCH WORKS:
//   1. Get all rooms that match the type/capacity filters
//   2. Find bookings that OVERLAP with the requested dates
//   3. Exclude those rooms from the results
//  
// DATE OVERLAP LOGIC:
//   A booking overlaps if:
//     existing.checkIn < requested.checkOut  AND
//     existing.checkOut > requested.checkIn
//
//   Example (overlap):
//     Existing:  |---Mar 15 to Mar 18---|
//     Requested:      |---Mar 17 to Mar 20---|
//     Overlaps because Mar 15 < Mar 20 AND Mar 18 > Mar 17
//
//   Example (no overlap):
//     Existing:  |---Mar 15 to Mar 18---|
//     Requested:                           |---Mar 20 to Mar 22---|
//     No overlap because Mar 18 < Mar 20 (the existing ends before new starts)
// ============================================
const searchAvailableRooms = async (req, res, next) => {
  try {
    const { checkIn, checkOut, type, capacity } = req.query;

    // Validate dates
    if (!checkIn || !checkOut) {
      res.status(400);
      throw new Error('Please provide checkIn and checkOut dates');
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Check-out must be after check-in
    if (checkOutDate <= checkInDate) {
      res.status(400);
      throw new Error('Check-out date must be after check-in date');
    }

    // Check-in must be today or in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkInDate < today) {
      res.status(400);
      throw new Error('Check-in date cannot be in the past');
    }

    // Step 1: Find all bookings that overlap with requested dates
    // We look for bookings that are NOT cancelled and NOT checked-out
    const overlappingBookings = await RoomBooking.find({
      status: { $nin: ['cancelled', 'checked-out'] },
      checkIn: { $lt: checkOutDate },   // existing starts before we leave
      checkOut: { $gt: checkInDate },    // existing ends after we arrive
    }).select('room');

    // Get the IDs of rooms that are already booked
    const bookedRoomIds = overlappingBookings.map((booking) => booking.room);

    // Step 2: Build filter for available rooms
    const roomFilter = {
      isActive: true,
      _id: { $nin: bookedRoomIds },      // Exclude booked rooms
      status: { $in: ['available', 'reserved'] },  // Only bookable rooms
    };

    if (type) roomFilter.type = type;
    if (capacity) roomFilter.capacity = { $gte: Number(capacity) };

    // Step 3: Find available rooms
    const availableRooms = await Room.find(roomFilter).sort('price');

    // Step 4: Calculate stay duration and total price for each room
    const durationMs = checkOutDate - checkInDate;
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

    const roomsWithPricing = availableRooms.map((room) => ({
      ...room.toObject(),
      stayDuration: durationDays,
      totalPrice: room.price * durationDays,
    }));

    res.json({
      success: true,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      stayDuration: `${durationDays} night(s)`,
      count: roomsWithPricing.length,
      rooms: roomsWithPricing,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
//
// ROLE-BASED FILTERING:
//   - Customer sees only THEIR bookings
//   - Staff sees ALL bookings
//   - Admin sees ALL bookings
// ============================================
const getAllBookings = async (req, res, next) => {
  try {
    let filter = {};

    // Customers can only see their own bookings
    if (req.user.role === 'customer') {
      filter.user = req.user._id;
    }

    // Optional status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // .populate() replaces the ObjectId with the actual document data
    // Instead of: { user: "507f1f77..." }
    // You get: { user: { _id: "507f1f77...", name: "John", email: "john@mail.com" } }
    const bookings = await RoomBooking.find(filter)
      .populate('user', 'name email phone')      // Get user's name, email, phone
      .populate('room', 'roomNumber type price')  // Get room's number, type, price
      .sort('-createdAt');                         // Newest first

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
// ============================================
const getBookingById = async (req, res, next) => {
  try {
    const booking = await RoomBooking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('room', 'roomNumber type price floor amenities');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Customers can only view their own bookings
    if (
      req.user.role === 'customer' &&
      booking.user._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('You can only view your own bookings');
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
//
// WHAT HAPPENS:
//   1. Validate dates and room
//   2. Check room is available for those dates
//   3. Calculate stay duration and total price
//   4. Create the booking
//   5. Update room status to 'reserved'
// ============================================
const createBooking = async (req, res, next) => {
  try {
    const { room: roomId, checkIn, checkOut, numberOfGuests, specialRequests } = req.body;

    // ---------- Validation ----------
    if (!roomId || !checkIn || !checkOut || !numberOfGuests) {
      res.status(400);
      throw new Error('Please provide room, checkIn, checkOut, and numberOfGuests');
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      res.status(400);
      throw new Error('Check-out date must be after check-in date');
    }

    // ---------- Check room exists ----------
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    if (!room.isActive) {
      res.status(400);
      throw new Error('This room is no longer available');
    }

    // ---------- Check guest capacity ----------
    if (numberOfGuests > room.capacity) {
      res.status(400);
      throw new Error(
        `This room holds ${room.capacity} guests. You requested ${numberOfGuests}.`
      );
    }

    // ---------- Check room availability for dates ----------
    const overlapping = await RoomBooking.findOne({
      room: roomId,
      status: { $nin: ['cancelled', 'checked-out'] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (overlapping) {
      res.status(400);
      throw new Error('This room is already booked for the selected dates');
    }

    // ---------- Calculate pricing ----------
    const durationMs = checkOutDate - checkInDate;
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * durationDays;

    // ---------- Create booking ----------
    const booking = await RoomBooking.create({
      user: req.user._id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numberOfGuests,
      totalPrice,
      specialRequests: specialRequests || '',
      status: 'confirmed',
    });

    // ---------- Update room status ----------
    room.status = 'reserved';
    await room.save();

    // Populate the response with full details
    const populatedBooking = await RoomBooking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('room', 'roomNumber type price');

    res.status(201).json({
      success: true,
      message: `Room ${room.roomNumber} booked for ${durationDays} night(s)`,
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer — own bookings, Admin — any)
//
// RULES:
//   - Can only cancel 'pending' or 'confirmed' bookings
//   - Cannot cancel if guest already checked in
//   - Room status returns to 'available'
// ============================================
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Customers can only cancel their own bookings
    if (
      req.user.role === 'customer' &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('You can only cancel your own bookings');
    }

    // Can only cancel pending or confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      res.status(400);
      throw new Error(
        `Cannot cancel a booking with status "${booking.status}". Only pending or confirmed bookings can be cancelled.`
      );
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Return room to available
    const room = await Room.findById(booking.room);
    if (room && room.status === 'reserved') {
      room.status = 'available';
      await room.save();
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Modify a booking (dates, guests, requests)
// @route   PUT /api/bookings/:id
// @access  Private (Customer — own, Admin — any)
//
// RULES:
//   - Can only modify 'pending' or 'confirmed' bookings
//   - If changing dates, must check availability again
//   - Recalculates total price if dates change
// ============================================
const modifyBooking = async (req, res, next) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Customers can only modify their own bookings
    if (
      req.user.role === 'customer' &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('You can only modify your own bookings');
    }

    // Can only modify pending or confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      res.status(400);
      throw new Error(
        `Cannot modify a booking with status "${booking.status}". Only pending or confirmed bookings can be modified.`
      );
    }

    const { checkIn, checkOut, numberOfGuests, specialRequests } = req.body;

    // ---------- If dates are changing, re-check availability ----------
    if (checkIn || checkOut) {
      const newCheckIn = checkIn ? new Date(checkIn) : booking.checkIn;
      const newCheckOut = checkOut ? new Date(checkOut) : booking.checkOut;

      if (newCheckOut <= newCheckIn) {
        res.status(400);
        throw new Error('Check-out date must be after check-in date');
      }

      // Check for overlapping bookings (excluding THIS booking)
      const overlapping = await RoomBooking.findOne({
        _id: { $ne: booking._id },       // Exclude current booking
        room: booking.room,
        status: { $nin: ['cancelled', 'checked-out'] },
        checkIn: { $lt: newCheckOut },
        checkOut: { $gt: newCheckIn },
      });

      if (overlapping) {
        res.status(400);
        throw new Error('Room is not available for the new dates');
      }

      booking.checkIn = newCheckIn;
      booking.checkOut = newCheckOut;

      // Recalculate total price
      const room = await Room.findById(booking.room);
      const durationMs = newCheckOut - newCheckIn;
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
      booking.totalPrice = room.price * durationDays;
    }

    // ---------- Update other fields ----------
    if (numberOfGuests) {
      // Check capacity
      const room = await Room.findById(booking.room);
      if (numberOfGuests > room.capacity) {
        res.status(400);
        throw new Error(`Room capacity is ${room.capacity} guests`);
      }
      booking.numberOfGuests = numberOfGuests;
    }

    if (specialRequests !== undefined) {
      booking.specialRequests = specialRequests;
    }

    await booking.save();

    const updatedBooking = await RoomBooking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('room', 'roomNumber type price');

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Check-in a guest
// @route   PUT /api/bookings/:id/checkin
// @access  Private (Staff, Admin)
//
// WHAT HAPPENS:
//   1. Booking status → 'checked-in'
//   2. Room status → 'occupied'
// ============================================
const checkIn = async (req, res, next) => {
  try {
    const booking = await RoomBooking.findById(req.params.id)
      .populate('room', 'roomNumber');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Can only check-in confirmed bookings
    if (booking.status !== 'confirmed') {
      res.status(400);
      throw new Error(
        `Cannot check-in. Booking status is "${booking.status}". Must be "confirmed".`
      );
    }

    // Update booking status
    booking.status = 'checked-in';
    await booking.save();

    // Update room status to occupied
    await Room.findByIdAndUpdate(booking.room._id, { status: 'occupied' });

    res.json({
      success: true,
      message: `Guest checked in to Room ${booking.room.roomNumber}`,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Check-out a guest
// @route   PUT /api/bookings/:id/checkout
// @access  Private (Staff, Admin)
//
// WHAT HAPPENS:
//   1. Booking status → 'checked-out'
//   2. Room status → 'available'
//   3. Calculate final stay duration
// ============================================
const checkOut = async (req, res, next) => {
  try {
    const booking = await RoomBooking.findById(req.params.id)
      .populate('room', 'roomNumber price')
      .populate('user', 'name email');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Can only check-out if currently checked-in
    if (booking.status !== 'checked-in') {
      res.status(400);
      throw new Error(
        `Cannot check-out. Booking status is "${booking.status}". Must be "checked-in".`
      );
    }

    // Update booking status
    booking.status = 'checked-out';
    await booking.save();

    // Update room status back to available
    await Room.findByIdAndUpdate(booking.room._id, { status: 'available' });

    // Calculate stay summary
    const durationMs = booking.checkOut - booking.checkIn;
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      message: `Guest checked out from Room ${booking.room.roomNumber}`,
      summary: {
        guest: booking.user.name,
        room: booking.room.roomNumber,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        duration: `${durationDays} night(s)`,
        totalPrice: booking.totalPrice,
        isPaid: booking.isPaid,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchAvailableRooms,
  getAllBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  modifyBooking,
  checkIn,
  checkOut,
};
