import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiCheckCircle, FiXCircle, FiBarChart2, FiTrendingUp, FiUsers } from 'react-icons/fi';
import api from '../../api/sportsApi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({ totalBookings: 0, statuses: [], popularFacilities: [] });
  const [recent, setRecent] = useState([]);
  const [facilitiesCount, setFacilitiesCount] = useState({ sport: 0, service: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, bookRes, facRes] = await Promise.all([
          api.get('/reports/dashboard'),
          api.get('/bookings'),
          api.get('/facilities'),
        ]);
        
        setMetrics(dashRes.data || { totalBookings: 0, statuses: [], popularFacilities: [] });
        // The endpoint sorts by createdAt desc already
        setRecent(bookRes.data?.slice(0, 5) || []);
        
        const sportC = facRes.data.filter(f => f.type === 'sport').length;
        const servC = facRes.data.filter(f => f.type === 'service').length;
        setFacilitiesCount({ sport: sportC, service: servC });
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusCount = (status) => {
    const s = metrics.statuses.find(x => x._id === status);
    return s ? s.count : 0;
  };

  const pending  = getStatusCount('pending');
  const approved = getStatusCount('approved');
  const rejected = getStatusCount('rejected');
  const total    = metrics.totalBookings || 0;

  const facilityUsage = (metrics.popularFacilities || []).slice(0, 5).map(f => ({
    name: f.name,
    booked: f.count,
  }));

  const QUICK_CARDS = [
    { label: 'Total Bookings', value: total, icon: <FiCalendar />, color: 'blue', path: '/sports/admin/bookings' },
    { label: 'Pending', value: pending, icon: <FiBarChart2 />, color: 'accent', path: '/sports/admin/bookings' },
    { label: 'Approved', value: approved, icon: <FiCheckCircle />, color: 'green', path: '/sports/admin/bookings' },
    { label: 'Rejected', value: rejected, icon: <FiXCircle />, color: 'red', path: '/sports/admin/bookings' },
    { label: 'Facilities', value: facilitiesCount.sport, icon: <FiUsers />, color: 'purple', path: '/sports/admin/slots' },
    { label: 'Services', value: facilitiesCount.service, icon: <FiTrendingUp />, color: 'teal', path: '/sports/admin/slots' },
  ];

  if (loading) {
    return (
      <div className="loading-container" style={{ padding: '60px 0' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of sports & student services booking activity</p>
      </div>

      <div className="dashboard-stats-grid">
        {QUICK_CARDS.map((c, i) => (
          <div key={i} className={`dash-stat-card dash-${c.color}`} onClick={() => navigate(c.path)}>
            <div className="dash-stat-icon">{c.icon}</div>
            <div>
              <div className="dash-stat-value">{c.value}</div>
              <div className="dash-stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dash-section">
          <div className="section-header">
            <h2>Recent Bookings</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/sports/admin/bookings')}>
              View All →
            </button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Facility</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(b => (
                  <tr key={b._id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', color: 'var(--accent-primary)', fontWeight: 700 }}>
                        #{b._id.substring(b._id.length - 6).toUpperCase()}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{b.facilityServiceId?.name}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{b.date}</td>
                    <td>
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recent.length === 0 && <p style={{ padding: 20, textAlign: 'center' }}>No recent bookings.</p>}
          </div>
        </div>

        <div className="dash-section">
          <div className="section-header">
            <h2>Facility Usage</h2>
          </div>
          <div className="dash-usage-list">
            {facilityUsage.map((f, i) => (
              <div key={i} className="dash-usage-item">
                <div className="dash-usage-info">
                  <p className="dash-usage-name">{f.name}</p>
                  <p className="dash-usage-count">{f.booked} bookings</p>
                </div>
                <div className="dash-usage-bar-wrap">
                  <div
                    className="dash-usage-bar"
                    style={{ width: `${Math.min((f.booked / Math.max(1, total)) * 100 * 3, 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {facilityUsage.length === 0 && <p style={{ padding: 20, textAlign: 'center' }}>No usage data.</p>}
          </div>

          <div className="dash-admin-nav">
            {[
              { label: '📅 Manage Slots', path: '/sports/admin/slots' },
              { label: '⚙️ Limits & Rules', path: '/sports/admin/limits' },
              { label: '📊 View Reports', path: '/sports/admin/reports' },
            ].map(n => (
              <button
                key={n.path}
                className="btn btn-secondary btn-sm"
                onClick={() => navigate(n.path)}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;