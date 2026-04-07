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
} = require('../controllers/notificationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);

// User routes
router.get('/', getNotifications);
router.get('/unread/count', getUnreadCount);
router.get('/booking/:bookingId', getNotificationsByBooking);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// Admin routes
router.post('/', restrictTo('admin', 'staff'), createNotification);

module.exports = router;
