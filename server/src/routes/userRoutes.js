const express = require('express');
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  getMyOrders,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { requireStudent } = require('../middleware/roleMiddleware');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.get('/me/orders', protect, requireStudent, getMyOrders);

module.exports = router;