import { useState, useEffect } from 'react';
import api from '../api';
import './AdminPriorityReviewPage.css';

const AdminPriorityReviewPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modal, setModal] = useState(false);
    const [actionData, setActionData] = useState({});

    useEffect(() => {
        fetchPriorityBookings();
    }, [filter]);

    const fetchPriorityBookings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/bookings', {
                params: { sortBy: 'priority', status: filter }
            });
            const priorityBookings = res.data.filter(b => b.isPriority);
            setBookings(priorityBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyPriority = async (bookingId, verified) => {
        try {
            await api.put(`/bookings/${bookingId}/status`, {
                status: 'approved',
                priorityVerified: verified
            });
            await fetchPriorityBookings();
            setModal(false);
            setSelectedBooking(null);
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    const handleApproveReject = async (bookingId, status, reason = '') => {
        try {
            const data = { status };
            if (status === 'rejected') data.rejectReason = reason;
            await api.put(`/bookings/${bookingId}/status`, data);
            await fetchPriorityBookings();
            setModal(false);
            setSelectedBooking(null);
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner" /></div>;
    }

    return (
        <div className="priority-review-page">
            <div className="page-header">
                <h2>🔴 Priority Booking Review</h2>
                <p>Review and verify urgent booking requests</p>
            </div>

            <div className="filter-tabs">
                {['pending', 'approved', 'rejected'].map(status => (
                    <button
                        key={status}
                        className={`filter-tab ${filter === status ? 'active' : ''}`}
                        onClick={() => setFilter(status)}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        <span className="count">{bookings.filter(b => b.status === status).length}</span>
                    </button>
                ))}
            </div>

            {bookings.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>No priority bookings with status: {filter}</p>
                </div>
            ) : (
                <div className="bookings-table-container">
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Student</th>
                                <th>Facility</th>
                                <th>Date & Time</th>
                                <th>Request Type</th>
                                <th>Verified</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className={`status-${booking.status}`}>
                                    <td className="booking-id">
                                        #{booking._id.substring(booking._id.length - 6).toUpperCase()}
                                    </td>
                                    <td>
                                        <div className="student-info">
                                            <strong>{booking.userId?.name}</strong>
                                            <small>{booking.userId?.email}</small>
                                        </div>
                                    </td>
                                    <td>{booking.facilityServiceId?.name}</td>
                                    <td>
                                        {booking.date} @ {booking.startTime}
                                    </td>
                                    <td>
                                        <div className="request-type">
                                            {booking.priorityReason || 'Urgent'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`verified-badge ${booking.priorityVerified ? 'verified' : 'unverified'}`}>
                                            {booking.priorityVerified ? '✓ Verified' : '⚠️ Not Verified'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${booking.status}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="action-btn view-btn"
                                            onClick={() => {
                                                setSelectedBooking(booking);
                                                setModal(true);
                                            }}
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modal && selectedBooking && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Review Priority Booking</h3>
                            <button className="close-btn" onClick={() => setModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="booking-details">
                                <div className="detail-row">
                                    <span>Booking ID:</span>
                                    <strong>#{selectedBooking._id.substring(selectedBooking._id.length - 6).toUpperCase()}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Student:</span>
                                    <strong>{selectedBooking.userId?.name}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Email:</span>
                                    <strong>{selectedBooking.userId?.email}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Facility:</span>
                                    <strong>{selectedBooking.facilityServiceId?.name}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Date & Time:</span>
                                    <strong>{selectedBooking.date} @ {selectedBooking.startTime} - {selectedBooking.endTime}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Priority Reason:</span>
                                    <strong>{selectedBooking.priorityReason}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Current Status:</span>
                                    <span className={`status-badge status-${selectedBooking.status}`}>
                                        {selectedBooking.status}
                                    </span>
                                </div>
                            </div>

                            {selectedBooking.status === 'pending' && (
                                <div className="action-section">
                                    <h4>Priority Verification</h4>
                                    <p>Is the priority claim valid?</p>

                                    <div className="verification-buttons">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleVerifyPriority(selectedBooking._id, true)}
                                        >
                                            <span>✓</span> Verify & Approve
                                        </button>
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleVerifyPriority(selectedBooking._id, false)}
                                        >
                                            <span>⚠️</span> Invalid Priority
                                        </button>
                                    </div>

                                    <div className="form-group">
                                        <label>Rejection Reason (if rejecting):</label>
                                        <textarea
                                            placeholder="Provide a reason for rejection..."
                                            value={actionData.reason || ''}
                                            onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
                                            rows={3}
                                        />
                                    </div>

                                    {actionData.reason && (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleApproveReject(selectedBooking._id, 'rejected', actionData.reason)}
                                        >
                                            Reject Booking
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPriorityReviewPage;
