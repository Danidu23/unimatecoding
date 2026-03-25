const express = require('express');
const router = express.Router();

const {
  verifyPayment,
  rejectPayment,
} = require('../controllers/paymentController');

const { protect } = require('../middleware/authMiddleware');
const { requireStaff } = require('../middleware/roleMiddleware');

router.patch('/:orderId/verify', protect, requireStaff, verifyPayment);
router.patch('/:orderId/reject', protect, requireStaff, rejectPayment);

module.exports = router;