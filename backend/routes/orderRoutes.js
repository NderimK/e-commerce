const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} = require('../controllers/orderController.js');

const { protected, isAdmin } = require('../middleware/authMiddleware');

router
  .route('/')
  .post(protected, addOrderItems)
  .get(protected, isAdmin, getOrders);

router.route('/myorders').get(protected, getMyOrders);
router.route('/:id').get(protected, getOrderById);
router.route('/:id/pay').put(protected, updateOrderToPaid);
router.route('/:id/deliver').put(protected, isAdmin, updateOrderToDelivered);

module.exports = router;
