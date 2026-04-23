import { useState, useEffect } from 'react';
import api from '../../api/sportsApi';
import { FiDownload, FiFilter } from 'react-icons/fi';
import './AdminReportsPage.css';

const AdminReportsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [dateRange, setDateRange] = useState('all');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ totalBookings: 0, statuses: [], popularFacilities: [] });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [dashRes, bookRes, facRes] = await Promise.all([
          api.get('/reports/dashboard'),
          api.get('/bookings'),
          api.get('/facilities'),
        ]);
        setMetrics(dashRes.data || { totalBookings: 0, statuses: [], popularFacilities: [] });
        setBookings(bookRes.data || []);
        setFacilities(facRes.data || []);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filtered = bookings.filter(b => {
    const facId = b.facilityServiceId?._id || b.facilityServiceId;
    const facMatch = facilityFilter === 'all' || facId === facilityFilter;
    return facMatch;
  });

  const getStatusCount = (arr, status) => arr.filter(b => b.status === status).length;

  const stats = {
    total:      filtered.length,
    approved:   getStatusCount(filtered, 'approved') + getStatusCount(filtered, 'completed'),
    pending:    getStatusCount(filtered, 'pending'),
    cancelled:  getStatusCount(filtered, 'cancelled'),
    rejected:   getStatusCount(filtered, 'rejected'),
  };
  const approvalRate = stats.total ? Math.round((stats.approved / stats.total) * 100) : 0;

  // Usage by facility (calculated locally for filters to work)
  const usageByFacility = facilities.map(f => ({
    ...f,
    count: filtered.filter(b => (b.facilityServiceId?._id || b.facilityServiceId) === f._id).length,
  })).sort((a, b) => b.count - a.count);

  const maxCount = usageByFacility[0]?.count || 1;

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Booking ID', 'Facility', 'Date', 'Time', 'Participants', 'Status'];
    const csvRows = filtered.map(b => [
      b._id,
      b.facilityServiceId?.name || 'Unknown Facility',
      b.date,
      `${b.startTime} - ${b.endTime}`,
      b.participants,
      b.status
    ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading-container" style={{padding:'60px 0'}}><div className="spinner" /></div>;

  return (
    <div className="admin-reports-page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Reports & Usage Dashboard</h1>
          <p>Booking analytics and facility utilization data</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="reports-filters">
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Date Range</label>
          <select className="form-input" value={dateRange} onChange={e => setDateRange(e.target.value)}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Facility / Service</label>
          <select className="form-input" value={facilityFilter} onChange={e => setFacilityFilter(e.target.value)}>
            <option value="all">All Facilities</option>
            {facilities.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="reports-kpi-grid">
        {[
          { label: 'Total Bookings',  value: stats.total,        color: 'blue' },
          { label: 'Approval Rate',   value: `${approvalRate}%`, color: 'green' },
          { label: 'Pending',         value: stats.pending,      color: 'accent' },
          { label: 'Cancellations',   value: stats.cancelled,    color: 'red' },
          { label: 'Rejected',        value: stats.rejected,     color: 'orange' },
        ].map((k, i) => (
          <div key={i} className={`kpi-card kpi-${k.color}`}>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="reports-grid">
        {/* Status Breakdown */}
        <div className="report-section">
          <h3>Status Breakdown</h3>
          <div className="status-breakdown">
            {[
              { label: 'Approved/Completed', count: stats.approved,  colorVar: 'var(--accent-green)' },
              { label: 'Pending',            count: stats.pending,   colorVar: 'var(--accent-primary)' },
              { label: 'Rejected',           count: stats.rejected,  colorVar: 'var(--accent-red)' },
              { label: 'Cancelled',          count: stats.cancelled, colorVar: 'var(--text-muted)' },
            ].map((s, i) => (
              <div key={i} className="status-bar-row">
                <div className="status-bar-label">
                  <span style={{ color: s.colorVar, fontWeight: 700 }}>●</span>
                  {s.label}
                </div>
                <div className="status-bar-track">
                  <div
                    className="status-bar-fill"
                    style={{
                      width: `${stats.total ? (s.count / stats.total) * 100 : 0}%`,
                      background: s.colorVar,
                    }}
                  />
                </div>
                <span className="status-bar-count">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage by Facility */}
        <div className="report-section">
          <h3>Usage by Facility</h3>
          <div className="facility-usage-report">
            {usageByFacility.map((f) => (
              <div key={f._id} className="fur-row">
                <div className="fur-name">{f.name}</div>
                <div className="fur-bar-wrap">
                  <div
                    className="fur-bar"
                    style={{ width: `${(f.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="fur-count">{f.count}</span>
              </div>
            ))}
            {usageByFacility.length === 0 && <p style={{color: 'var(--text-muted)'}}>No facility data</p>}
          </div>
        </div>
      </div>

      {/* Raw Bookings Table */}
      <div className="report-section">
        <h3>Detailed Booking Records</h3>
        <div className="table-container" style={{ marginTop: 16 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Facility</th>
                <th>Date</th>
                <th>Time</th>
                <th>Participants</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b._id}>
                  <td><span style={{ fontFamily: 'monospace', color: 'var(--accent-primary)', fontWeight: 700 }}>#{b._id.substring(b._id.length - 6).toUpperCase()}</span></td>
                  <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{b.facilityServiceId?.name}</td>
                  <td style={{ fontSize: '0.82rem' }}>{b.date}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{b.startTime} – {b.endTime}</td>
                  <td style={{ textAlign: 'center' }}>{b.participants}</td>
                  <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', color: 'var(--text-muted)'}}>No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;