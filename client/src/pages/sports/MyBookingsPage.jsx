import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isBefore } from 'date-fns';
import api from '../../api/sportsApi';
import SportsQRCodeModal from '../../components/sports/SportsQRCodeModal';
import SportsFeedbackForm from '../../components/sports/SportsFeedbackForm';
import { FiCalendar, FiFilter, FiX, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import './MyBookingsPage.css';

const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'];

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showQR, setShowQR] = useState(null);
  const [showFeedback, setShowFeedback] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my');
        // Backend already sorts newest first
        setBookings(data);
      } catch (error) {
        console.error('Failed to load bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = activeStatus === 'All'
    ? bookings
    : bookings.filter(b => b.status.toLowerCase() === activeStatus.toLowerCase());

  const canCancel = (booking) => {
    if (!['pending', 'approved'].includes(booking.status)) return false;
    if (!booking.cancelDeadline) return true;
    return !isBefore(parseISO(booking.cancelDeadline), new Date());
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    setErrorMsg('');
    try {
      await api.put(`/bookings/${cancelTarget._id}/cancel`);
      setBookings(prev =>
        prev.map(b =>
          b._id === cancelTarget._id ? { ...b, status: 'cancelled' } : b
        )
      );
      setSuccessMsg(`Booking #${cancelTarget._id.substring(cancelTarget._id.length - 6).toUpperCase()} has been cancelled.`);
      setTimeout(() => setSuccessMsg(''), 4000);
      setCancelTarget(null);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Cancellation failed.');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr) => {
    try { return format(parseISO(dateStr + 'T00:00:00'), 'EEE, MMM d yyyy'); }
    catch { return dateStr; }
  };

  const formatCreated = (iso) => {
    try { return format(parseISO(iso), 'MMM d, h:mm a'); }
    catch { return iso; }
  };

  if (loading) return <div className="loading-container" style={{padding:'60px 0'}}><div className="spinner" /></div>;

  return (
    <div className="mybookings-page">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Track and manage all your facility and service reservations</p>
      </div>

      {successMsg && (
        <div className="alert alert-success">{successMsg}</div>
      )}

      {/* Status Filter */}
      <div className="mybookings-filters">
        <FiFilter style={{ color: 'var(--text-muted)' }} />
        {STATUS_FILTERS.map(s => (
          <button
            key={s}
            className={`filter-tab ${activeStatus === s ? 'active' : ''}`}
            onClick={() => setActiveStatus(s)}
          >
            {s}
            {s !== 'All' && (
              <span className="filter-count">
                {bookings.filter(b => b.status.toLowerCase() === s.toLowerCase()).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No bookings found</h3>
          <p>You have no {activeStatus !== 'All' ? activeStatus.toLowerCase() : ''} bookings yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/sports')}>
            Make a Booking
          </button>
        </div>
      ) : (
        <div className="mybookings-list">
          {filtered.map(booking => {
            const cancellable = canCancel(booking);
            const isCompleted = booking.status === 'completed';
            const isCancelled = booking.status === 'cancelled';
            const displayId = booking._id.substring(booking._id.length - 6).toUpperCase();

            return (
              <div key={booking._id} className={`booking-item ${isCompleted || isCancelled ? 'booking-item-dim' : ''}`}>
                <div className="booking-item-left">
                  <div className="booking-item-header">
                    <h4 className="booking-facility-title">{booking.facilityServiceId?.name || 'Unknown Facility'}</h4>
                    <span className={`badge badge-${booking.status}`}>{booking.status}</span>
                  </div>

                  <div className="booking-item-meta">
                    <div className="bi-meta-item">
                      <FiCalendar />
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className="bi-meta-item">
                      🕐 {booking.startTime} – {booking.endTime}
                    </div>
                    {booking.attendanceStatus && booking.attendanceStatus !== 'pending' && (
                      <div className="bi-meta-item" style={{ color: 'var(--accent-green)' }}>
                        <FiCheckCircle />
                        <span>{booking.attendanceStatus.replace('-', ' ')}</span>
                      </div>
                    )}
                    {booking.participants > 1 && (
                      <div className="bi-meta-item">
                        👥 {booking.participants} participants
                      </div>
                    )}
                  </div>

                  <div className="booking-item-footer">
                    <span className="booking-id-label">#{displayId}</span>
                    <span className="booking-created">Created {formatCreated(booking.createdAt)}</span>
                  </div>

                  {booking.cancelReason && (
                    <p className="booking-cancel-reason">
                      Reason: {booking.cancelReason}
                    </p>
                  )}
                  {booking.rejectReason && (
                    <p className="booking-cancel-reason">
                      Reject Reason: {booking.rejectReason}
                    </p>
                  )}
                </div>

                <div className="booking-item-right">
                  {!isCompleted && !isCancelled && booking.status !== 'rejected' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {booking.status === 'approved' && booking.attendanceStatus === 'pending' && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => setShowQR(booking)}
                        >
                          Show QR Code
                        </button>
                      )}

                      {cancellable ? (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setCancelTarget(booking)}
                        >
                          Cancel Booking
                        </button>
                      ) : (
                        <div className="cancel-deadline-msg">
                          <FiAlertTriangle />
                          <span>Cancellation deadline passed</span>
                        </div>
                      )}
                    </div>
                  )}
                  {isCompleted && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {!booking.feedbackSubmitted ? (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => setShowFeedback(booking)}
                        >
                          Rate Experience
                        </button>
                      ) : (
                        <span className="booking-readonly-label" style={{ color: 'var(--accent-green)' }}>
                          Feedback Submitted
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Modal */}
      {cancelTarget && (
        <div className="modal-overlay" onClick={() => setCancelTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cancel Booking</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setCancelTarget(null)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
              
              <div className="alert alert-warning" style={{ marginBottom: 20 }}>
                <FiAlertTriangle />
                Are you sure you want to cancel your booking for <strong>{cancelTarget.facilityServiceId?.name}</strong>?
              </div>

              <div className="cancel-booking-details">
                <div className="conf-row">
                  <span>Date</span>
                  <strong>{formatDate(cancelTarget.date)}</strong>
                </div>
                <div className="conf-row">
                  <span>Time</span>
                  <strong>{cancelTarget.startTime} – {cancelTarget.endTime}</strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setCancelTarget(null)}>
                Keep Booking
              </button>
              <button
                className="btn btn-danger"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modals */}
      <SportsQRCodeModal 
        isOpen={!!showQR}
        onClose={() => setShowQR(null)}
        booking={showQR}
      />

      <SportsFeedbackForm
        isOpen={!!showFeedback}
        onClose={() => setShowFeedback(null)}
        booking={showFeedback}
        onSubmitted={() => {
          setBookings(prev => 
            prev.map(b => b._id === showFeedback._id ? { ...b, feedbackSubmitted: true } : b)
          );
        }}
      />
    </div>
  );
};

export default MyBookingsPage;