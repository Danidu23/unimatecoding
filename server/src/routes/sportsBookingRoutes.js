const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    updateBookingStatus
} = require('../controllers/sportsBookingController');
const { protect } = require('../middleware/authMiddleware');
const { requireStudent, requireSportsManager } = require('../middleware/roleMiddleware');

// Student routes
router.post('/', protect, requireStudent, createBooking);
router.get('/my', protect, requireStudent, getMyBookings);
router.put('/:id/cancel', protect, requireStudent, cancelBooking);

// Admin routes
router.get('/', protect, requireSportsManager, getAllBookings);
router.put('/:id/status', protect, requireSportsManager, updateBookingStatus);

module.exports = router;