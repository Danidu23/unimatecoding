import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiFilter, FiX, FiAlertTriangle, FiStar } from 'react-icons/fi';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { format, parseISO, isBefore } from 'date-fns';
import './MyBookingsPage.css';

const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'];

const MyBookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [qrToken, setQrToken] = useState(null);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

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
    if (user) fetchBookings();
  }, [user]);

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

  const handleFeedbackSubmit = async () => {
    if (!feedbackTarget || !rating) return;
    setSubmittingFeedback(true);
    setErrorMsg('');
    try {
      await api.post(`/bookings/${feedbackTarget._id}/rate`, { rating, feedback: feedbackText });
      setBookings(prev =>
        prev.map(b =>
          b._id === feedbackTarget._id ? { ...b, rating, feedback: feedbackText } : b
        )
      );
      setSuccessMsg('Thank you for your feedback!');
      setTimeout(() => setSuccessMsg(''), 4000);
      setFeedbackTarget(null);
      setFeedbackText('');
      setRating(5);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
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
          <button className="btn btn-primary" onClick={() => navigate('/home')}>
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

                <div className="booking-item-right" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {booking.status === 'approved' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setQrToken(booking.qrCodeToken)}
                    >
                      View QR Code
                    </button>
                  )}
                  {!isCompleted && !isCancelled && booking.status !== 'rejected' && booking.status !== 'checked-in' && (
                    <>
                      {cancellable ? (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setCancelTarget(booking)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <div className="cancel-deadline-msg">
                          <FiAlertTriangle />
                          <span>Deadline passed</span>
                        </div>
                      )}
                    </>
                  )}
                  {isCompleted && !booking.rating && (
                     <button
                       className="btn btn-secondary btn-sm"
                       onClick={() => setFeedbackTarget(booking)}
                     >
                       <FiStar /> Leave Feedback
                     </button>
                  )}
                  {isCompleted && booking.rating && (
                     <div style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                       ★ {booking.rating}/5 Rated
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

      {/* QR Code Modal */}
      {qrToken && (
        <div className="modal-overlay" onClick={() => setQrToken(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="modal-header" style={{ borderBottom: 'none' }}>
              <h3 style={{ margin: '0 auto' }}>Check-in QR Code</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setQrToken(null)} style={{ position: 'absolute', right: 20 }}>
                <FiX />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', display: 'inline-block' }}>
                <QRCodeSVG value={qrToken} size={256} />
              </div>
              <p style={{ marginTop: 20, color: 'var(--text-secondary)' }}>
                Present this QR code to the facility staff to check in.
              </p>
              <div 
                style={{ marginTop: 16, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)', userSelect: 'all', cursor: 'text', border: '1px solid var(--border-primary)' }}
              >
                <strong style={{display: 'block', marginBottom: 4}}>Raw Token (For Testing):</strong>
                <span style={{fontFamily: 'monospace'}}>{qrToken}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackTarget && (
        <div className="modal-overlay" onClick={() => setFeedbackTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rate Your Experience</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setFeedbackTarget(null)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
              <p style={{ marginBottom: 16 }}>How was your booking at <strong>{feedbackTarget.facilityServiceId?.name}</strong>?</p>
              
              <div className="form-group" style={{ marginBottom: 24, textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <FiStar 
                      key={star}
                      size={32}
                      onClick={() => setRating(star)}
                      style={{ 
                        cursor: 'pointer', 
                        fill: star <= rating ? 'var(--accent-primary)' : 'none',
                        color: star <= rating ? 'var(--accent-primary)' : 'var(--text-muted)'
                      }} 
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Feedback (Optional)</label>
                <textarea
                  className="form-input"
                  rows="4"
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Tell us what you liked or how we can improve..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setFeedbackTarget(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleFeedbackSubmit}
                disabled={submittingFeedback}
              >
                {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookingsPage;
