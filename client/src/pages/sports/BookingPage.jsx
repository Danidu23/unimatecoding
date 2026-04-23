import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar, FiClock, FiUsers, FiCheckCircle, FiAlertCircle, FiStar } from 'react-icons/fi';
import api from '../../api/sportsApi';
import { format, addDays } from 'date-fns';
import SmartSuggestionPanel from '../../components/sports/SmartSuggestionPanel';
import OccupancyIndicator from '../../components/sports/OccupancyIndicator';
import PriorityBookingForm from '../../components/sports/PriorityBookingForm';
import './BookingPage.css';

const BookingPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [facility, setFacility] = useState(null);
  const [globalRules, setGlobalRules] = useState({
    sportsCancelHoursBefore: 2,
    serviceCancelHoursBefore: 4,
    maxBookingsPerDay: 3
  });
  
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 1));
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [participants, setParticipants] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  
  const [isPriority, setIsPriority] = useState(false);
  const [priorityReason, setPriorityReason] = useState('');

  // Fetch Facility details and Global Rules once
  useEffect(() => {
    const initData = async () => {
      try {
        const [facRes, rulesRes] = await Promise.all([
          api.get(`/facilities/${id}`),
          api.get('/rules').catch(() => ({ data: globalRules })) // fallback
        ]);
        setFacility(facRes.data);
        if (rulesRes.data && rulesRes.data._id) {
          setGlobalRules(rulesRes.data);
        }
      } catch (err) {
        console.error('Failed to load facility', err);
      }
    };
    initData();
  }, [id]);

  // Fetch Slots when Date changes
  useEffect(() => {
    if (!facility) return;
    const fetchSlots = async () => {
      setLoading(true);
      setSelectedSlot(null);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const { data } = await api.get(`/slots?facilityServiceId=${id}&date=${dateStr}`);
        setSlots(data);
      } catch (err) {
        console.error('Failed to load slots', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, id, facility]);

  if (!facility && !loading) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">❌</div>
        <h3>Facility not found</h3>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (success) {
    return <BookingConfirmation booking={success} navigate={navigate} />;
  }

  const handleSubmit = async () => {
    if (!selectedSlot) { setError('Please select a time slot.'); return; }
    if (participants < 1) { setError('Number of participants must be at least 1.'); return; }
    if (participants > facility.capacity) {
      setError(`Maximum capacity is ${facility.capacity} participants.`);
      return;
    }
    if (isPriority && !priorityReason) {
      setError('Please provide a reason for priority booking.');
      return;
    }
    
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', {
        slotId: selectedSlot._id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        participants,
        isPriority,
        priorityReason
      });
      setSuccess({
        id: data._id,
        facilityName: facility.name,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        isPriority: data.isPriority
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  return (
    <div className="booking-page">
      {!facility ? (
        <div className="loading-container" style={{ padding: '80px 0', width: '100%' }}>
          <div className="spinner" />
          <span>Loading facility details...</span>
        </div>
      ) : (
      <>
      <div className="booking-left">
        <div className="booking-facility-header">
          <img src={facility.image} alt={facility.name} className="booking-facility-img" />
          <div className="booking-facility-info">
            <div className="booking-facility-tags">
              <span className={`badge badge-${facility.category}`}>{facility.category}</span>
              {facility.tags?.map(t => (
                <span key={t} className={`badge badge-${t.replace(' ', '-')}`}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{facility.name}</h2>
              {facility.averageRating > 0 && (
                <div className="facility-rating" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  color: 'var(--accent-primary)',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  background: 'rgba(232, 184, 75, 0.1)',
                  padding: '4px 12px',
                  borderRadius: '20px'
                }}>
                  <FiStar fill="currentColor" size={18} />
                  <span>{facility.averageRating}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.85rem' }}>
                    ({facility.numRatings} reviews)
                  </span>
                </div>
              )}
            </div>
            <p>{facility.description}</p>
            <div className="booking-facility-meta-row">
              <div className="bfm-item">
                <FiClock />
                <span>{facility.operatingHours.open} – {facility.operatingHours.close}</span>
              </div>
              <div className="bfm-item">
                <FiUsers />
                <span>Max {facility.capacity} people</span>
              </div>
            </div>
            {facility.provider && (
              <p className="booking-provider">Provider: <strong>{facility.provider}</strong></p>
            )}
          </div>
        </div>

        <div className="booking-section">
          <h3>Select Date</h3>
          <div className="booking-datepicker-wrap">
            <FiCalendar className="booking-datepicker-icon" />
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              minDate={addDays(new Date(), 0)} // Allow today
              maxDate={addDays(new Date(), 30)}
              dateFormat="EEEE, MMMM d, yyyy"
              placeholderText="Select date..."
              className="form-input"
              wrapperClassName="react-datepicker-wrapper"
            />
          </div>
        </div>

        <div className="booking-section">
          <h3>Available Slots & Occupancy</h3>
          <p className="booking-section-sub">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>

          <OccupancyIndicator 
            facilityServiceId={id} 
            date={dateStr}
            slots={slots}
          />

          {loading ? (
            <div className="loading-container" style={{ padding: '40px 0' }}>
              <div className="spinner" />
              <span>Loading slots...</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <div className="empty-state-icon">📅</div>
              <p>No slots available for this date</p>
            </div>
          ) : (
            <>
              <SmartSuggestionPanel 
                facilityServiceId={id} 
                date={dateStr} 
                onSelectSlot={(slot) => setSelectedSlot(slot)} 
              />
              <div className="slots-grid" style={{ marginTop: '16px' }}>
              {slots.map(slot => {
                const isSelected = selectedSlot?._id === slot._id;
                const unavailable = slot.status !== 'available';
                return (
                  <button
                    key={slot._id}
                    className={`slot-btn ${isSelected ? 'selected' : ''} ${unavailable ? 'unavailable' : ''}`}
                    onClick={() => !unavailable && setSelectedSlot(slot)}
                    disabled={unavailable}
                  >
                    <span className="slot-time">{slot.startTime} – {slot.endTime}</span>
                    <span className="slot-status-label">
                      {slot.status === 'blocked' ? '🚫 Blocked' :
                       slot.status === 'full'    ? '🔴 Full' :
                       isSelected               ? '✓ Selected' : 
                       '✓ Available'}
                    </span>
                    {!unavailable && (
                      <span className="slot-capacity">
                        {slot.booked}/{slot.capacity} booked
                      </span>
                    )}
                  </button>
                );
              })}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="booking-right">
        <div className="booking-summary-card">
          <h3>Booking Summary</h3>
          <div className="divider" />

          <div className="booking-summary-rows">
             <div className="summary-row">
              <span>Facility</span>
              <strong>{facility.name}</strong>
            </div>
            <div className="summary-row">
              <span>Date</span>
              <strong>{format(selectedDate, 'MMM d, yyyy')}</strong>
            </div>
            <div className="summary-row">
              <span>Time Slot</span>
              <strong>{selectedSlot ? `${selectedSlot.startTime} – ${selectedSlot.endTime}` : '—'}</strong>
            </div>
            <div className="summary-row">
              <span>Duration</span>
              <strong>{facility.slotDurationMinutes} min</strong>
            </div>
          </div>

          {facility.capacity > 1 && facility.type === 'sport' && (
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Number of Participants</label>
              <input
                type="number"
                className="form-input"
                min={1}
                max={facility.capacity}
                value={participants}
                onChange={e => setParticipants(Number(e.target.value))}
              />
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Max: {facility.capacity}
              </span>
            </div>
          )}

          <PriorityBookingForm 
            facilityType={facility.type}
            onPriorityChange={(data) => {
              setIsPriority(data.isPriority);
              setPriorityReason(data.priorityReason);
            }}
          />

          <div className="divider" />

          <div className="booking-rules-box">
             <p className="booking-rules-title">📋 Booking Rules</p>
            <ul className="booking-rules-list">
              <li>Status starts as <strong>Pending</strong></li>
              <li>Admin approval required (if applicable)</li>
              <li>Cancel {facility.type === 'service' ? globalRules.serviceCancelHoursBefore : globalRules.sportsCancelHoursBefore}+ hrs before slot</li>
              <li>Max {globalRules.maxBookingsPerDay} bookings per day</li>
            </ul>
          </div>

          {error && (
            <div className="alert alert-error">
              <FiAlertCircle /> {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleSubmit}
            disabled={!selectedSlot || submitting}
            style={{ marginTop: 8 }}
          >
            {submitting
              ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Submitting...</>
              : <><FiCheckCircle /> Confirm Booking</>}
          </button>

          <button className="btn btn-ghost btn-full" onClick={() => navigate(-1)} style={{ marginTop: 8 }}>
            Cancel
          </button>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

/* ---- Booking Confirmation Screen ---- */
const BookingConfirmation = ({ booking, navigate }) => (
  <div className="confirmation-page">
    <div className="confirmation-card">
      <div className="confirmation-icon">✅</div>
      <h2>Booking Submitted!</h2>
      <p className="confirmation-sub">Your booking is pending admin approval.</p>

      <div className="confirmation-details">
        <div className="conf-row">
          <span>Booking ID</span>
          <strong className="conf-id">#{booking.id.substring(booking.id.length - 6).toUpperCase()}</strong>
        </div>
        <div className="conf-row">
          <span>Facility</span>
          <strong>{booking.facilityName}</strong>
        </div>
        <div className="conf-row">
          <span>Date & Time</span>
          <strong>{booking.date}, {booking.startTime} – {booking.endTime}</strong>
        </div>
        <div className="conf-row">
          <span>Status</span>
          <strong style={{ color: booking.isPriority ? '#d32f2f' : '#ff9800' }}>
            {booking.isPriority ? '🔴 Priority Pending' : '⏳ Pending Approval'}
          </strong>
        </div>
      </div>

      <div className="confirmation-info">
        <p>📧 You'll receive a notification when your booking is approved or rejected.</p>
        {booking.isPriority && (
          <p>🔴 <strong>Priority Request:</strong> This will be reviewed with urgent priority.</p>
        )}
      </div>

      <div className="confirmation-actions">
        <button className="btn btn-primary" onClick={() => navigate('/sports/my-bookings')}>
          View My Bookings
        </button>
        <button className="btn btn-ghost" onClick={() => navigate('/sports')}>
          Back to Home
        </button>
      </div>
    </div>
  </div>
);

export default BookingPage;