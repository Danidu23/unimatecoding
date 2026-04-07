import React, { useState, useEffect } from 'react';
import api from '../api';
import { FaBell } from 'react-icons/fa';
import { FiX, FiCheck, FiTrash2 } from 'react-icons/fi';
import './NotificationCenter.css';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications', {
                params: { limit: 20 }
            });
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            await fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'booking_submitted': return '📝';
            case 'booking_approved': return '✅';
            case 'booking_rejected': return '❌';
            case 'reminder_30min': return '⏰';
            case 'priority_request': return '🔴';
            case 'waitlist_available': return '🎉';
            default: return '🔔';
        }
    };

    const getNotificationColor = (priority) => {
        switch (priority) {
            case 'high': return 'priority-high';
            case 'normal': return 'priority-normal';
            default: return 'priority-low';
        }
    };

    return (
        <div className="notification-center">
            <button 
                className="bell-btn" 
                onClick={() => setIsOpen(!isOpen)}
                title="Notifications"
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="dropdown-header">
                        <h4>Notifications</h4>
                        <div className="header-actions">
                            {unreadCount > 0 && (
                                <button 
                                    className="mark-all-btn" 
                                    onClick={markAllAsRead}
                                    title="Mark all as read"
                                >
                                    <FiCheck size={16} /> Mark all read
                                </button>
                            )}
                            <button 
                                className="close-btn"
                                onClick={() => setIsOpen(false)}
                                title="Close"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <div className="dropdown-body">
                        {notifications.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🔔</div>
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <div className="notif-list">
                                {notifications.map(notif => (
                                    <div 
                                        key={notif._id} 
                                        className={`notif-item ${notif.isRead ? 'read' : 'unread'} ${getNotificationColor(notif.priority)}`}
                                    >
                                        <div className="notif-icon">
                                            {getNotificationIcon(notif.type)}
                                        </div>
                                        <div 
                                            className="notif-content"
                                            onClick={() => !notif.isRead && markAsRead(notif._id)}
                                        >
                                            <p className="notif-message">{notif.message}</p>
                                            <span className="notif-time">
                                                {new Date(notif.createdAt).toLocaleDateString()} 
                                                {' '} 
                                                {new Date(notif.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteNotification(notif._id)}
                                            title="Delete"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="dropdown-footer">
                        <a href="/notifications" className="view-all-link">
                            View all notifications →
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
