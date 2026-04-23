const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    updateBookingStatus,
    checkInBooking,
    completeBooking
} = require('../controllers/sportsBookingController');
const { protect } = require('../middleware/authMiddleware');
const { requireStudent, requireSportsAdmin } = require('../middleware/roleMiddleware');

// Student routes
router.post('/', protect, requireStudent, createBooking);
router.get('/my', protect, requireStudent, getMyBookings);
router.put('/:id/cancel', protect, requireStudent, cancelBooking);

// Admin routes
router.get('/', protect, requireSportsAdmin, getAllBookings);
router.put('/:id/status', protect, requireSportsAdmin, updateBookingStatus);
router.put('/:id/check-in', protect, requireSportsAdmin, checkInBooking);
router.put('/:id/complete', protect, requireSportsAdmin, completeBooking);

module.exports = router;