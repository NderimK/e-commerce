const asyncHandler = require('../middleware/asyncHandler');
const generateToken = require('../utils/generateToken');
const User = require('../models/userModel.js');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Auth user & get token
// @route   GET /api/v1/user/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      success: true,
      data: user,
      token: generateToken(user._id),
    });
  } else {
    return next(new ErrorResponse(`Invalid Email or password`, 401));
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorResponse(`User already exists`, 400));
  }
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: user,
      token: generateToken(user._id),
    });
  } else {
    return next(new ErrorResponse(`Invalid user data`, 400));
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      success: true,
      data: user,
    });
  } else {
    return next(new ErrorResponse(`User not found`, 404));
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: updatedUser,
      token: generateToken(updatedUser._id),
    });
  } else {
    return next(new ErrorResponse(`User not found`, 404));
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: false });
  res.status(200).json({ success: true, data: users });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res) => {});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {});
