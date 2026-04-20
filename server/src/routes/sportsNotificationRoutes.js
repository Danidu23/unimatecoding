const express = require('express');
const router = express.Router();
const { 
    getNotifications, 
    getUnreadCount,
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    createNotification,
    getNotificationsByBooking
} = require('../controllers/sportsNotificationController');
const { protect } = require('../middleware/authMiddleware');
const { requireSportsAdmin } = require('../middleware/roleMiddleware');

router.use(protect);

// User routes
router.get('/', getNotifications);
router.get('/unread/count', getUnreadCount);
router.get('/booking/:bookingId', getNotificationsByBooking);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// Sports manager routes
router.post('/', requireSportsAdmin, createNotification);

module.exports = router;