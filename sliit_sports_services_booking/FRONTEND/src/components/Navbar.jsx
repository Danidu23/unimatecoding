import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiCalendar, FiUser, FiLogOut,
  FiMenu, FiX, FiSettings, FiBarChart2
} from 'react-icons/fi';
import NotificationCenter from './NotificationCenter';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const studentLinks = [
    { to: '/home',        label: 'Home',        icon: <FiHome /> },
    { to: '/my-bookings', label: 'My Bookings', icon: <FiCalendar /> },
  ];

  const adminLinks = [
    { to: '/admin',           label: 'Dashboard', icon: <FiBarChart2 /> },
    { to: '/admin/bookings',  label: 'Bookings',  icon: <FiCalendar /> },
    { to: '/admin/slots',     label: 'Slots',     icon: <FiSettings /> },
    { to: '/admin/reports',   label: 'Reports',   icon: <FiBarChart2 /> },
    { to: '/admin/priority',  label: 'Priority',  icon: <FiBarChart2 /> },
    { to: '/admin/occupancy', label: 'Occupancy', icon: <FiBarChart2 /> },
  ];

  const links = (user?.role === 'admin' || user?.role === 'staff') ? adminLinks : studentLinks;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/home" className="navbar-logo">
          <div className="navbar-logo-icon">U</div>
          <span className="navbar-logo-text">UniMate</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          {links.map(l => (
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

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Notifications */}
          <div className="navbar-notif-wrap">
            <NotificationCenter />
          </div>

          {/* Profile */}
          <div className="navbar-profile-wrap">
            <button
              className="navbar-avatar"
              onClick={() => { setProfileOpen(!profileOpen); }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-avatar-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="profile-name">{user?.name}</p>
                    <p className="profile-email">{user?.email}</p>
                    <span className={`badge badge-${user?.role === 'admin' ? 'completed' : 'approved'}`}>
                      {user?.role}
                    </span>
                  </div>
                </div>
                <div className="profile-menu">
                  <button className="profile-menu-item" onClick={() => { setProfileOpen(false); }}>
                    <FiUser /> Profile
                  </button>
                  <button className="profile-menu-item danger" onClick={handleLogout}>
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          {links.map(l => (
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
