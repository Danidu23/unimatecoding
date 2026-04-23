import { useState, useEffect } from 'react';
import {
  FiCheckCircle, FiXCircle, FiClock, FiCalendar,
  FiFilter, FiSearch, FiLoader
} from 'react-icons/fi';
import api from '../../api/sportsApi';
import { format, parseISO } from 'date-fns';
import './AdminBookingsPage.css';

const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed'];

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings');
        setBookings(data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = bookings.filter(b => {
    const matchFilter = activeFilter === 'All' || b.status.toLowerCase() === activeFilter.toLowerCase();
    const facilityName = b.facilityServiceId?.name || '';
    const userIdStr = b.userId?._id || b.userId || '';
    
    const matchSearch = !search || facilityName.toLowerCase().includes(search.toLowerCase())
      || b._id.toLowerCase().includes(search.toLowerCase())
      || userIdStr.toString().toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const setMsg = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 4000); };

  const handleApprove = async (booking) => {
    if (booking.status !== 'pending') return;
    setLoadingId(booking._id);
    try {
      await api.put(`/bookings/${booking._id}/status`, { status: 'approved' });
      setBookings(prev => prev.map(b => b._id === booking._id ? { ...b, status: 'approved' } : b));
      setMsg(`Booking #${booking._id.substring(booking._id.length - 6).toUpperCase()} approved!`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to approve booking.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setLoadingId(rejectModal._id);
    try {
      await api.put(`/bookings/${rejectModal._id}/status`, { status: 'rejected', rejectReason });
      setBookings(prev => prev.map(b => b._id === rejectModal._id ? { ...b, status: 'rejected', rejectReason } : b));
      setMsg(`Booking #${rejectModal._id.substring(rejectModal._id.length - 6).toUpperCase()} rejected.`);
      setRejectModal(null);
      setRejectReason('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to reject booking.');
    } finally {
      setLoadingId(null);
    }
  };

  const formatDate = (s) => {
    try { return format(parseISO(s + 'T00:00:00'), 'MMM d, yyyy'); } catch { return s; }
  };

  const counts = (status) => bookings.filter(b => b.status === status).length;

  if (loading) return <div className="loading-container" style={{padding:'60px 0'}}><div className="spinner" /></div>;

  return (
    <div className="admin-bookings-page">
      <div className="page-header">
        <h1>Booking Requests</h1>
        <p>Review, approve, or reject incoming booking requests</p>
      </div>

      <div className="admin-stats-row">
        {[
          { label: 'Pending', value: counts('pending'), color: 'accent', icon: <FiClock /> },
          { label: 'Approved', value: counts('approved'), color: 'green', icon: <FiCheckCircle /> },
          { label: 'Rejected', value: counts('rejected'), color: 'red', icon: <FiXCircle /> },
          { label: 'Total', value: bookings.length, color: 'blue', icon: <FiCalendar /> },
        ].map(s => (
          <div key={s.label} className={`admin-stat admin-stat-${s.color}`}>
            <div className="admin-stat-icon">{s.icon}</div>
            <div>
              <div className="admin-stat-value">{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="admin-controls">
        <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
          <FiSearch className="search-icon" />
          <input
            className="form-input"
            placeholder="Search by facility, ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              className={`filter-tab ${activeFilter === s ? 'active' : ''}`}
              onClick={() => setActiveFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Student</th>
              <th>Facility / Service</th>
              <th>Date & Time</th>
              <th>Participants</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                  No bookings found
                </td>
              </tr>
            ) : filtered.map(b => {
              const uIdStr = b.userId?._id || b.userId || 'U';
              const fac = b.facilityServiceId || {};
              return (
              <tr key={b._id}>
                <td><span className="admin-booking-id">#{b._id.substring(b._id.length - 6).toUpperCase()}</span></td>
                <td>
                  <div className="admin-student-cell">
                    <div className="admin-avatar">{(b.userId?.name || uIdStr).charAt(0).toUpperCase()}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{b.userId?.name || 'Student'}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{fac.name}</p>
                    <span className={`badge badge-${fac.type === 'service' ? 'completed' : 'indoor'} mt-1`} style={{ fontSize: '0.68rem' }}>
                      {fac.type}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.82rem' }}>
                    <p>{formatDate(b.date)}</p>
                    <p style={{ color: 'var(--text-muted)' }}>{b.startTime} – {b.endTime}</p>
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>{b.participants}</td>
                <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                <td>
                  {b.status === 'pending' ? (
                    <div className="admin-action-btns">
                      <button
                        className="btn btn-sm"
                        style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)', border: '1px solid rgba(45,212,164,0.3)' }}
                        onClick={() => handleApprove(b)}
                        disabled={loadingId === b._id}
                      >
                        {loadingId === b._id ? '...' : '✓ Approve'}
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'var(--accent-red-bg)', color: 'var(--accent-red)', border: '1px solid rgba(239,68,68,0.3)' }}
                        onClick={() => setRejectModal(b)}
                        disabled={loadingId === b._id}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {rejectModal && (
        <div className="modal-overlay" onClick={() => setRejectModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reject Booking #{rejectModal._id.substring(rejectModal._id.length - 6).toUpperCase()}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setRejectModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>
                You are rejecting the booking for <strong style={{ color: 'var(--text-primary)' }}>{rejectModal.facilityServiceId?.name}</strong> on {formatDate(rejectModal.date)}.
              </p>
              <div className="form-group">
                <label className="form-label">Rejection Reason (optional)</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Enter reason for rejection..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setRejectModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleReject} disabled={!!loadingId}>
                {loadingId ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;