const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    updateBookingStatus
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Student routes
router.post('/', protect, restrictTo('student'), createBooking);
router.get('/my', protect, restrictTo('student'), getMyBookings);
router.put('/:id/cancel', protect, restrictTo('student'), cancelBooking);

// Admin routes
router.get('/', protect, restrictTo('admin', 'staff'), getAllBookings);
router.put('/:id/status', protect, restrictTo('admin', 'staff'), updateBookingStatus);

module.exports = router;
