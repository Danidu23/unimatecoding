import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiClock, FiTrendingUp } from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { MdOutlineLocalHospital } from 'react-icons/md';
import './HomePage.css';

const QUICK_STATS = [
  { label: 'Available Sports Slots', value: '24', icon: <FiTrendingUp />, color: 'accent' },
  { label: 'Student Services',       value: '12', icon: <FiClock />,       color: 'green' },
  { label: 'Facilities Available',   value: '9',  icon: <FiCalendar />,    color: 'blue' },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (

    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>🏟</span> SLIIT Sports & Services Platform
          </div>
          <h1 className="hero-title">
            Sports & Student Services<br />
            <span className="hero-title-accent">Booking System</span>
          </h1>
          <p className="hero-subtitle">
            Reserve sports facilities and student services online — fast, fair, and hassle-free.
            Choose a category to get started with your booking.
          </p>
          <div className="hero-cta">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/sports/book/facilities')}
            >
              Browse & Book <FiArrowRight />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/sports/my-bookings')}
            >
              <FiCalendar /> My Bookings
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-glow" />
          <div className="hero-icon-grid">
            <div className="hero-icon-card">⚽</div>
            <div className="hero-icon-card highlight">🏋️</div>
            <div className="hero-icon-card">🏏</div>
            <div className="hero-icon-card">🏸</div>
            <div className="hero-icon-card highlight">🎾</div>
            <div className="hero-icon-card">🏀</div>
            <div className="hero-icon-card">🏐</div>
            <div className="hero-icon-card highlight">🩺</div>
            <div className="hero-icon-card">💬</div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="home-stats">
        {QUICK_STATS.map((s, i) => (
          <div key={i} className={`home-stat-card stat-${s.color}`}>
            <div className="home-stat-icon">{s.icon}</div>
            <div>
              <div className="home-stat-value">{s.value}</div>
              <div className="home-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Info Bar */}
      <div className="info-bar">
        <span>⏰</span>
        <span>Peak booking times: <strong>7–9 AM</strong> and <strong>5–7 PM</strong></span>
        <span className="info-bar-dot">•</span>
        <span>Sports cancellation: <strong>2 hrs before</strong></span>
        <span className="info-bar-dot">•</span>
        <span>Doctor/Counseling cancellation: <strong>4 hrs before</strong></span>
      </div>

      {/* Category Cards */}
      <section>
        <div className="section-header">
          <h2>What would you like to do?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Choose a service to get started
          </p>
        </div>

        <div className="category-cards">
          {/* Sports */}
          <div
            className="category-card"
            onClick={() => navigate('/sports/book/facilities')}
          >
            <div className="category-card-badge">🔥 Popular</div>
            <div className="category-icon sports-icon">
              <GiWeightLiftingUp />
            </div>
            <h3 className="category-title">Sports Facilities</h3>
            <p className="category-desc">
              Book gym, courts, and sports grounds for your fitness and recreation
            </p>
            <div className="category-slots">
              <span>Available today</span>
              <strong className="category-slot-count sports-count">24 slots</strong>
            </div>
            <button className="btn btn-primary btn-full">
              Continue <FiArrowRight />
            </button>
          </div>

          {/* Services */}
          <div
            className="category-card"
            onClick={() => navigate('/sports/book/services')}
          >
            <div className="category-icon service-icon">
              <MdOutlineLocalHospital />
            </div>
            <h3 className="category-title">Student Services</h3>
            <p className="category-desc">
              Schedule appointments for counselling and medical consultations
            </p>
            <div className="category-slots">
              <span>Available today</span>
              <strong className="category-slot-count service-count">12 slots</strong>
            </div>
            <button className="btn btn-primary btn-full">
              Continue <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="home-recent-section">
        <h2 style={{ marginBottom: 16 }}>Recent Bookings</h2>
        <div className="home-recent-list">
          {[
            { fac: 'Badminton Court', date: 'Mar 22, 2026 • 10:00 AM', status: 'approved' },
            { fac: 'Doctor Channeling', date: 'Mar 23, 2026 • 2:00 PM', status: 'pending' },
            { fac: 'Gym', date: 'Mar 19, 2026 • 7:00 AM', status: 'completed' },
          ].map((b, i) => (
            <div key={i} className="home-recent-item">
              <div>
                <p className="home-recent-title">{b.fac}</p>
                <p className="home-recent-date">{b.date}</p>
              </div>
              <span className={`badge badge-${b.status}`}>{b.status}</span>
            </div>
          ))}
        </div>
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginTop: 16 }}
          onClick={() => navigate('/sports/my-bookings')}
        >
          View all bookings →
        </button>
      </section>
    </div>
  );
};

export default HomePage;