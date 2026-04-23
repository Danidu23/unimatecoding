import { useState, useEffect } from 'react';
import api from '../../api/sportsApi';
import { FiSave, FiAlertTriangle } from 'react-icons/fi';

const AdminLimitsPage = () => {
  const [rules, setRules] = useState({
    maxBookingsPerDay: 3,
    sportsCancelHoursBefore: 2,
    serviceCancelHoursBefore: 4
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const { data } = await api.get('/rules');
        if (data && data._id) setRules(data);
      } catch (err) {
        console.error('Failed to fetch rules', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  const handleSave = async () => {
    try {
      await api.put('/rules', rules);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save rules');
    }
  };

  const update = (key, val) => setRules(prev => ({ ...prev, [key]: Number(val) }));

  if (loading) return <div className="loading-container" style={{padding:'60px 0'}}><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Limits & Rules Configuration</h1>
        <p>Configure global booking rules applied to all students</p>
      </div>

      <div className="alert alert-warning" style={{ marginBottom: 24 }}>
        <FiAlertTriangle />
        Changes apply only to future bookings and slots (not existing ones).
      </div>

      {saved && (
        <div className="alert alert-success" style={{ marginBottom: 24 }}>
          ✅ Settings saved successfully!
        </div>
      )}

      <div className="grid-2">
        <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3>Student Booking Limits</h3>
          <div className="form-group">
            <label className="form-label">Max Bookings Per Student Per Day</label>
            <input
              type="number"
              className="form-input"
              min={1}
              max={10}
              value={rules.maxBookingsPerDay}
              onChange={e => update('maxBookingsPerDay', e.target.value)}
            />
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Currently: {rules.maxBookingsPerDay} bookings/day
            </span>
          </div>
        </div>

        <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3>Cancellation Deadlines</h3>
          <div className="form-group">
            <label className="form-label">Sports: Cancel at least N hours before slot</label>
            <input
              type="number"
              className="form-input"
              min={1}
              max={48}
              value={rules.sportsCancelHoursBefore}
              onChange={e => update('sportsCancelHoursBefore', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Doctor/Counseling: Cancel at least N hours before</label>
            <input
              type="number"
              className="form-input"
              min={1}
              max={48}
              value={rules.serviceCancelHoursBefore}
              onChange={e => update('serviceCancelHoursBefore', e.target.value)}
            />
          </div>
        </div>

        <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3>Current Rules Summary</h3>
          <div className="divider" />
          {[
            { label: 'Max bookings/day', value: `${rules.maxBookingsPerDay}` },
            { label: 'Sports cancel window', value: `${rules.sportsCancelHoursBefore} hrs before` },
            { label: 'Service cancel window', value: `${rules.serviceCancelHoursBefore} hrs before` },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
              <strong>{r.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <button className="btn btn-primary btn-lg" onClick={handleSave}>
          <FiSave /> Save Configuration
        </button>
      </div>
    </div>
  );
};

export default AdminLimitsPage;