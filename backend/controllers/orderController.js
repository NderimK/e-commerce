const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/orderModel.js');
ErrorResponse = require('../utils/ErrorResponse');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(new ErrorResponse('No order items', 400));
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      data: createdOrder,
    });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json({
      success: true,
      data: order,
    });
  } else {
    return next(new ErrorResponse('Order not found', 404));
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
    });
  } else {
    return next(new ErrorResponse('Order not found', 404));
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
    });
  } else {
    return next(new ErrorResponse('Order not found', 404));
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.json({
    success: true,
    data: orders,
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json({
    success: true,
    data: orders,
  });
});
