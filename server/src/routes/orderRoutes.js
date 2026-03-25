const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrdersFromOrdersRoute,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');
const { requireStudent, requireStaff } = require('../middleware/roleMiddleware');

router.post('/', protect, requireStudent, createOrder);
router.get('/my', protect, requireStudent, getMyOrdersFromOrdersRoute);
router.get('/', protect, requireStaff, getAllOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/cancel', protect, cancelOrder);
router.patch('/:id/status', protect, requireStaff, updateOrderStatus);

module.exports = router;