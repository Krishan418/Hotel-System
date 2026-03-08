// ============================================
// controllers/authController.js — Authentication Logic
// ============================================
//
// This file contains the BUSINESS LOGIC for authentication.
// Each function here handles a specific auth action.
//
// AUTHENTICATION FLOW:
//
//   REGISTRATION:
//   ┌──────────┐   POST /api/auth/register   ┌──────────────┐
//   │  Client   │ ──────────────────────────> │  register()  │
//   │  (React)  │                             │              │
//   │           │                             │ 1. Validate  │
//   │           │                             │ 2. Check if  │
//   │           │                             │    email     │
//   │           │                             │    exists    │
//   │           │                             │ 3. Create    │
//   │           │                             │    user      │
//   │           │   { token, user }           │ 4. Generate  │
//   │           │ <────────────────────────── │    JWT token │
//   └──────────┘                             └──────────────┘
//
//   LOGIN:
//   ┌──────────┐   POST /api/auth/login      ┌──────────────┐
//   │  Client   │ ──────────────────────────> │   login()    │
//   │  (React)  │                             │              │
//   │           │                             │ 1. Find user │
//   │           │                             │    by email  │
//   │           │                             │ 2. Compare   │
//   │           │                             │    password  │
//   │           │   { token, user }           │ 3. Generate  │
//   │           │ <────────────────────────── │    JWT token │
//   └──────────┘                             └──────────────┘
//
//   GET PROFILE (Protected):
//   ┌──────────┐     GET /api/auth/me         ┌──────────────┐
//   │  Client   │ ──────────────────────────> │   getMe()    │
//   │  (React)  │   Authorization: Bearer JWT │              │
//   │           │                             │ auth.js runs │
//   │           │                             │ first to     │
//   │           │   { user }                  │ verify token │
//   │           │ <────────────────────────── │ & add user   │
//   └──────────┘                             └──────────────┘

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ============================================
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (anyone can register)
// ============================================
const register = async (req, res, next) => {
  try {
    // Step 1: Get data from the request body
    // req.body contains the JSON data sent by the frontend
    const { name, email, password, phone, role } = req.body;

    // Step 2: Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400); // 400 = Bad Request
      throw new Error('A user with this email already exists');
    }

    // Step 3: Validate that required fields are provided
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    // Step 4: Create the user in the database
    // The User model's pre-save hook will automatically hash the password
    const user = await User.create({
      name,
      email,
      password,
      phone,
      // Only allow 'customer' role during self-registration
      // Admin must manually assign other roles to prevent abuse
      role: role === 'customer' || !role ? 'customer' : 'customer',
    });

    // Step 5: Generate JWT token for the new user
    const token = generateToken(user._id, user.role);

    // Step 6: Send success response
    // We manually pick which fields to return (never send password!)
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    // Pass errors to the errorHandler middleware
    next(error);
  }
};

// ============================================
// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
// ============================================
const login = async (req, res, next) => {
  try {
    // Step 1: Get email and password from the request
    const { email, password } = req.body;

    // Step 2: Validate input
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Step 3: Find the user by email
    // We need to explicitly ask for the password field because
    // our User model has "select: false" on the password field
    const user = await User.findOne({ email }).select('+password');

    // Step 4: Check if user exists
    if (!user) {
      res.status(401); // 401 = Unauthorized
      throw new Error('Invalid email or password');
      // SECURITY NOTE: We say "Invalid email or password" instead of
      // "User not found" to prevent attackers from knowing which
      // emails are registered in our system.
    }

    // Step 5: Check if account is active
    if (!user.isActive) {
      res.status(401);
      throw new Error('Your account has been deactivated. Contact admin.');
    }

    // Step 6: Compare the provided password with the stored hash
    // This uses the comparePassword method we defined in the User model
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Step 7: Generate JWT token
    const token = generateToken(user._id, user.role);

    // Step 8: Send success response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Get current logged-in user's profile
// @route   GET /api/auth/me
// @access  Private (requires JWT token)
// ============================================
const getMe = async (req, res, next) => {
  try {
    // req.user is already set by the auth middleware
    // It contains the full user document (without password)
    // because auth.js does: req.user = await User.findById(decoded.id).select('-password')

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404); // 404 = Not Found
      throw new Error('User not found');
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Update current user's profile
// @route   PUT /api/auth/me
// @access  Private
// ============================================
const updateProfile = async (req, res, next) => {
  try {
    // Only allow updating these specific fields
    // Users should NOT be able to change their role or password through this route
    const allowedUpdates = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    };

    // Remove undefined fields (fields that weren't sent in the request)
    Object.keys(allowedUpdates).forEach((key) => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    // findByIdAndUpdate options:
    //   new: true → return the UPDATED document (not the old one)
    //   runValidators: true → still run schema validations on updates
    const user = await User.findByIdAndUpdate(req.user._id, allowedUpdates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
// ============================================
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error('Please provide current password and new password');
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('New password must be at least 6 characters');
    }

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error('Current password is incorrect');
    }

    // Update password (pre-save hook will hash it automatically)
    user.password = newPassword;
    await user.save();

    // Generate new token (optional, but good practice after password change)
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Password changed successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Export all controller functions
module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};
