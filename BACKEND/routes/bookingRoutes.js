const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    updateBookingStatus,
    scanQRCode,
    completeBooking,
    submitFeedback
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Student routes
router.post('/', protect, restrictTo('student'), createBooking);
router.get('/my', protect, restrictTo('student'), getMyBookings);
router.put('/:id/cancel', protect, restrictTo('student'), cancelBooking);
router.post('/:id/rate', protect, restrictTo('student'), submitFeedback);

// Admin routes
router.get('/', protect, restrictTo('admin', 'staff'), getAllBookings);
router.put('/:id/status', protect, restrictTo('admin', 'staff'), updateBookingStatus);
router.post('/scan', protect, restrictTo('admin', 'staff'), scanQRCode);
router.put('/:id/complete', protect, restrictTo('admin', 'staff'), completeBooking);

module.exports = router;
