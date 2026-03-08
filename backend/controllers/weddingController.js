// ============================================
// controllers/weddingController.js — Wedding Hall & Booking Logic
// ============================================
//
// This controller handles TWO related things:
//   1. Wedding HALLS — the venues themselves (Admin manages)
//   2. Wedding BOOKINGS — reservations for those venues (Customers create)
//
// WEDDING BOOKING FLOW:
//   ┌────────────┐     ┌──────────────┐     ┌───────────┐     ┌───────────┐
//   │  Customer   │     │   Pending    │     │ Confirmed │     │ Completed │
//   │  views halls│────>│   booking    │────>│  booking  │────>│   event   │
//   │  & books    │     │   created    │     │           │     │   done    │
//   └────────────┘     └──────────────┘     └───────────┘     └───────────┘
//                            │
//                            ▼
//                      ┌───────────┐
//                      │ Cancelled │
//                      └───────────┘

const WeddingHall = require('../models/WeddingHall');
const WeddingBooking = require('../models/WeddingBooking');

// ============================
//   WEDDING HALL CONTROLLERS
// ============================

// ============================================
// @desc    Get all wedding halls
// @route   GET /api/weddings/halls
// @access  Public
// ============================================
const getAllHalls = async (req, res, next) => {
  try {
    const filter = { isActive: true };

    // Optional filters
    if (req.query.minCapacity) {
      filter.capacity = { $gte: Number(req.query.minCapacity) };
    }
    if (req.query.maxPrice) {
      filter.pricePerDay = { $lte: Number(req.query.maxPrice) };
    }

    const halls = await WeddingHall.find(filter).sort('name');

    res.json({
      success: true,
      count: halls.length,
      halls,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get single wedding hall
// @route   GET /api/weddings/halls/:id
// @access  Public
// ============================================
const getHallById = async (req, res, next) => {
  try {
    const hall = await WeddingHall.findById(req.params.id);

    if (!hall) {
      res.status(404);
      throw new Error('Wedding hall not found');
    }

    res.json({ success: true, hall });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Create wedding hall
// @route   POST /api/weddings/halls
// @access  Private/Admin
// ============================================
const createHall = async (req, res, next) => {
  try {
    const { name, description, capacity, pricePerDay, location, services, images } = req.body;

    // Check if hall name already exists
    const existing = await WeddingHall.findOne({ name });
    if (existing) {
      res.status(400);
      throw new Error(`A hall named "${name}" already exists`);
    }

    const hall = await WeddingHall.create({
      name,
      description,
      capacity,
      pricePerDay,
      location,
      services: services || [],
      images: images || [],
    });

    res.status(201).json({
      success: true,
      message: `Wedding hall "${name}" created successfully`,
      hall,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Update wedding hall
// @route   PUT /api/weddings/halls/:id
// @access  Private/Admin
// ============================================
const updateHall = async (req, res, next) => {
  try {
    let hall = await WeddingHall.findById(req.params.id);

    if (!hall) {
      res.status(404);
      throw new Error('Wedding hall not found');
    }

    hall = await WeddingHall.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: `Hall "${hall.name}" updated successfully`,
      hall,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Delete wedding hall (soft delete)
// @route   DELETE /api/weddings/halls/:id
// @access  Private/Admin
// ============================================
const deleteHall = async (req, res, next) => {
  try {
    const hall = await WeddingHall.findById(req.params.id);

    if (!hall) {
      res.status(404);
      throw new Error('Wedding hall not found');
    }

    hall.isActive = false;
    await hall.save();

    res.json({
      success: true,
      message: `Hall "${hall.name}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Check hall availability for a specific date
// @route   GET /api/weddings/halls/:id/availability?date=2026-06-15
// @access  Public
//
// HOW IT WORKS:
//   Checks if any active booking exists for this hall on that date.
//   A hall can only host ONE event per day.
// ============================================
const checkHallAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      res.status(400);
      throw new Error('Please provide a date (e.g., ?date=2026-06-15)');
    }

    const hall = await WeddingHall.findById(req.params.id);
    if (!hall) {
      res.status(404);
      throw new Error('Wedding hall not found');
    }

    // Check for same-day bookings that are not cancelled
    const eventDate = new Date(date);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingBooking = await WeddingBooking.findOne({
      weddingHall: req.params.id,
      eventDate: { $gte: eventDate, $lt: nextDay },
      status: { $nin: ['cancelled'] },
    });

    res.json({
      success: true,
      hall: hall.name,
      date: eventDate,
      isAvailable: !existingBooking,
      message: existingBooking
        ? 'Hall is already booked for this date'
        : 'Hall is available for this date',
    });
  } catch (error) {
    next(error);
  }
};

// ================================
//   WEDDING BOOKING CONTROLLERS
// ================================

// ============================================
// @desc    Get all wedding bookings
// @route   GET /api/weddings/bookings
// @access  Private (Customer sees own, Admin sees all)
// ============================================
const getAllWeddingBookings = async (req, res, next) => {
  try {
    let filter = {};

    // Customers only see their own bookings
    if (req.user.role === 'customer') {
      filter.user = req.user._id;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const bookings = await WeddingBooking.find(filter)
      .populate('user', 'name email phone')
      .populate('weddingHall', 'name capacity pricePerDay location')
      .sort('-createdAt');

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
// @desc    Get single wedding booking
// @route   GET /api/weddings/bookings/:id
// @access  Private
// ============================================
const getWeddingBookingById = async (req, res, next) => {
  try {
    const booking = await WeddingBooking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('weddingHall', 'name capacity pricePerDay location services');

    if (!booking) {
      res.status(404);
      throw new Error('Wedding booking not found');
    }

    // Customers can only view their own
    if (
      req.user.role === 'customer' &&
      booking.user._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('You can only view your own bookings');
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Book a wedding hall
// @route   POST /api/weddings/bookings
// @access  Private (Customer)
//
// WHAT HAPPENS:
//   1. Validate hall exists and is active
//   2. Check the hall is available on the requested date
//   3. Check expected guests don't exceed capacity
//   4. Calculate total price (base + selected services)
//   5. Create the booking
// ============================================
const createWeddingBooking = async (req, res, next) => {
  try {
    const {
      weddingHall: hallId,
      eventDate,
      eventType,
      expectedGuests,
      selectedServices,
      specialRequests,
      contactPhone,
    } = req.body;

    // ---------- Validation ----------
    if (!hallId || !eventDate || !expectedGuests) {
      res.status(400);
      throw new Error('Please provide weddingHall, eventDate, and expectedGuests');
    }

    // ---------- Check hall exists ----------
    const hall = await WeddingHall.findById(hallId);
    if (!hall || !hall.isActive) {
      res.status(404);
      throw new Error('Wedding hall not found or is no longer available');
    }

    // ---------- Check capacity ----------
    if (expectedGuests > hall.capacity) {
      res.status(400);
      throw new Error(
        `Hall "${hall.name}" holds ${hall.capacity} guests. You requested ${expectedGuests}.`
      );
    }

    // ---------- Check availability ----------
    const bookingDate = new Date(eventDate);
    const nextDay = new Date(eventDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const conflict = await WeddingBooking.findOne({
      weddingHall: hallId,
      eventDate: { $gte: bookingDate, $lt: nextDay },
      status: { $nin: ['cancelled'] },
    });

    if (conflict) {
      res.status(400);
      throw new Error(`Hall "${hall.name}" is already booked on ${eventDate}`);
    }

    // ---------- Validate selected services ----------
    // Make sure the customer only selects services the hall offers
    const validServices = selectedServices
      ? selectedServices.filter((s) => hall.services.includes(s))
      : [];

    // ---------- Calculate total price ----------
    // Base price is the hall's price per day
    // In a real system you might add per-service pricing
    const totalPrice = hall.pricePerDay;

    // ---------- Create booking ----------
    const booking = await WeddingBooking.create({
      user: req.user._id,
      weddingHall: hallId,
      eventDate: bookingDate,
      eventType: eventType || 'wedding',
      expectedGuests,
      selectedServices: validServices,
      totalPrice,
      specialRequests: specialRequests || '',
      contactPhone: contactPhone || '',
      status: 'pending',
    });

    const populatedBooking = await WeddingBooking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('weddingHall', 'name capacity pricePerDay location');

    res.status(201).json({
      success: true,
      message: `Wedding hall "${hall.name}" booked for ${eventDate}`,
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Update wedding booking status
// @route   PUT /api/weddings/bookings/:id/status
// @access  Private/Admin
//
// STATUS OPTIONS:
//   pending   → Awaiting admin confirmation
//   confirmed → Admin approved the booking
//   completed → Event has taken place
//   cancelled → Booking was cancelled
// ============================================
const updateWeddingBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    const booking = await WeddingBooking.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error('Wedding booking not found');
    }

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      message: `Booking status changed: ${oldStatus} → ${status}`,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Cancel a wedding booking
// @route   PUT /api/weddings/bookings/:id/cancel
// @access  Private (Customer — own, Admin — any)
// ============================================
const cancelWeddingBooking = async (req, res, next) => {
  try {
    const booking = await WeddingBooking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Wedding booking not found');
    }

    // Customers can only cancel their own
    if (
      req.user.role === 'customer' &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('You can only cancel your own bookings');
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      res.status(400);
      throw new Error(`Cannot cancel a booking with status "${booking.status}"`);
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Wedding booking cancelled successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Hall controllers
  getAllHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
  checkHallAvailability,
  // Booking controllers
  getAllWeddingBookings,
  getWeddingBookingById,
  createWeddingBooking,
  updateWeddingBookingStatus,
  cancelWeddingBooking,
};
