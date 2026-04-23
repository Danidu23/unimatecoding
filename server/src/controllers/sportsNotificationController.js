const SportsNotification = require('../models/SportsNotification');

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const { unreadOnly = false, limit = 50 } = req.query;
        const query = { userId: req.user._id };
        if (unreadOnly === 'true') query.isRead = false;

        const notifications = await SportsNotification.find(query)
            .populate('bookingId', 'date startTime endTime status')
            .populate('facilityServiceId', 'name')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        const unreadCount = await SportsNotification.countDocuments({
            userId: req.user._id,
            isRead: false
        });

        res.status(200).json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await SportsNotification.countDocuments({
            userId: req.user._id,
            isRead: false
        });
        res.status(200).json({ unreadCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching unread count', error: error.message });
    }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await SportsNotification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        const isSportsAdmin =
            req.user?.role === 'admin' &&
            req.user?.permissions?.includes('sports_admin');

        if (notification.userId.toString() !== req.user._id.toString() && !isSportsAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
    try {
        await SportsNotification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notifications', error: error.message });
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
    try {
        const notification = await SportsNotification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        const isSportsAdmin =
            req.user?.role === 'admin' &&
            req.user?.permissions?.includes('sports_admin');

        if (notification.userId.toString() !== req.user._id.toString() && !isSportsAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await SportsNotification.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting notification', error: error.message });
    }
};

// @desc    Create a notification (Sports Admin only)
// @route   POST /api/notifications
// @access  Sports Admin
const createNotification = async (req, res) => {
    try {
        const { userId, facilityServiceId, message, type, priority = 'normal' } = req.body;

        if (!userId || !message || !type) {
            return res.status(400).json({ message: 'userId, message, and type are required' });
        }

        const notification = new SportsNotification({
            userId,
            facilityServiceId,
            message,
            type,
            priority
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error creating notification', error: error.message });
    }
};

// @desc    Get notifications by booking
// @route   GET /api/notifications/booking/:bookingId
// @access  Private
const getNotificationsByBooking = async (req, res) => {
    try {
        const notifications = await SportsNotification.find({ bookingId: req.params.bookingId })
            .sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    getNotificationsByBooking
};
