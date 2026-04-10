import { useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome, FiCalendar, FiUser, FiLogOut,
  FiMenu, FiX, FiSettings, FiBarChart2
} from 'react-icons/fi';
import NotificationCenter from './NotificationCenter';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const studentLinks = [
    { to: '/sports', label: 'Home', icon: <FiHome /> },
    { to: '/sports/my-bookings', label: 'My Bookings', icon: <FiCalendar /> },
  ];

  const adminLinks = [
    { to: '/sports/admin', label: 'Dashboard', icon: <FiBarChart2 /> },
    { to: '/sports/admin/bookings', label: 'Bookings', icon: <FiCalendar /> },
    { to: '/sports/admin/slots', label: 'Slots', icon: <FiSettings /> },
    { to: '/sports/admin/reports', label: 'Reports', icon: <FiBarChart2 /> },
    { to: '/sports/admin/priority', label: 'Priority', icon: <FiBarChart2 /> },
    { to: '/sports/admin/occupancy', label: 'Occupancy', icon: <FiBarChart2 /> },
  ];

  const isSportsManager =
    user?.role === 'admin' ||
    (user?.role === 'staff' && user?.staffType === 'sports');

  const links = isSportsManager ? adminLinks : studentLinks;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={isSportsManager ? '/sports/admin' : '/sports'} className="navbar-logo">
          <div className="navbar-logo-icon">U</div>
          <span className="navbar-logo-text">UniMate</span>
        </Link>

        <div className="navbar-links">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`navbar-link ${isActive(l.to) ? 'active' : ''}`}
            >
              {l.icon}
              <span>{l.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <div className="navbar-notif-wrap">
            <NotificationCenter />
          </div>

          <div className="navbar-profile-wrap">
            <button
              className="navbar-avatar"
              onClick={() => {
                setProfileOpen(!profileOpen);
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-avatar-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="profile-name">{user?.name}</p>
                    <p className="profile-email">{user?.email}</p>
                    <span
                      className={`badge badge-${user?.role === 'admin' ? 'completed' : 'approved'}`}
                    >
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="profile-menu">
                  <button
                    className="profile-menu-item"
                    onClick={() => {
                      setProfileOpen(false);
                    }}
                  >
                    <FiUser /> Profile
                  </button>
                  <button className="profile-menu-item danger" onClick={handleLogout}>
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="navbar-mobile-menu">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`navbar-mobile-link ${isActive(l.to) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.icon} {l.label}
            </Link>
          ))}
          <button className="navbar-mobile-link danger" onClick={handleLogout}>
            <FiLogOut /> Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;