import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiCalendar,
  FiUser,
  FiLogOut,
  FiArrowLeft,
  FiMenu,
  FiX,
  FiSettings,
  FiBarChart2,
} from 'react-icons/fi';
import NotificationCenter from './NotificationCenter';
import './Navbar.css';

const Navbar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const permissions = Array.isArray(user?.permissions)
    ? user.permissions
    : typeof user?.permissions === 'string'
      ? [user.permissions]
      : [];

  const isSportsManager =
    user?.role === 'admin' &&
    permissions.includes('sports_admin');

  const studentLinks = useMemo(
    () => [
      { to: '/sports', label: 'Home', icon: <FiHome /> },
      { to: '/sports/my-bookings', label: 'My Bookings', icon: <FiCalendar /> },
    ],
    []
  );

  const adminLinks = useMemo(
    () => [
      { to: '/sports/admin', label: 'Dashboard', icon: <FiBarChart2 /> },
      { to: '/sports/admin/bookings', label: 'Bookings', icon: <FiCalendar /> },
      { to: '/sports/admin/slots', label: 'Slots', icon: <FiSettings /> },
      { to: '/sports/admin/reports', label: 'Reports', icon: <FiBarChart2 /> },
      { to: '/sports/admin/priority', label: 'Priority', icon: <FiBarChart2 /> },
      { to: '/sports/admin/occupancy', label: 'Occupancy', icon: <FiBarChart2 /> },
    ],
    []
  );

  const links = isSportsManager ? adminLinks : studentLinks;
  const showDashboardBack = !isSportsManager;

  const isActive = (path) => {
    if (path === '/sports/admin') return location.pathname === '/sports/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    setLogoutConfirmOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const closeLogoutConfirm = () => {
    setLogoutConfirmOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {showDashboardBack && (
            <Link
              to="/dashboard"
              className="navbar-link navbar-back-link navbar-back-edge"
            >
              <FiArrowLeft />
              <span>Dashboard</span>
            </Link>
          )}

          <div className="navbar-left">
            <Link
              to={isSportsManager ? '/sports/admin' : '/sports'}
              className="navbar-logo"
            >
              <div className="navbar-logo-icon">U</div>
              <span className="navbar-logo-text">UniMate</span>
            </Link>
          </div>

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
                onClick={() => setProfileOpen((v) => !v)}
              >
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <div className="profile-avatar-lg">
                      {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="profile-name">{user?.name || 'User'}</div>
                      <div className="profile-email">{user?.email || ''}</div>
                    </div>
                  </div>

                  <div className="profile-menu">
                    <button className="profile-menu-item">
                      <FiUser />
                      <span>Profile</span>
                    </button>

                    <button
                      className="profile-menu-item danger"
                      onClick={handleLogout}
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="navbar-logout-btn" onClick={handleLogout}>
              <FiLogOut />
              <span>Logout</span>
            </button>

            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

              {menuOpen && (
          <div className="navbar-mobile-menu">
            {showDashboardBack && (
              <Link
                to="/dashboard"
                className="navbar-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                <FiArrowLeft />
                <span>Back to Dashboard</span>
              </Link>
            )}

            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`navbar-mobile-link ${isActive(l.to) ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.icon}
                <span>{l.label}</span>
              </Link>
            ))}

            <button
              className="navbar-mobile-link danger"
              onClick={handleLogout}
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        )}  
      </nav>

    {logoutConfirmOpen && (
        <div className="sports-logout-modal-overlay" onClick={closeLogoutConfirm}>
          <div
            className="sports-logout-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sports-logout-modal-header">
              <div className="sports-logout-modal-icon">
                <FiLogOut />
              </div>
              <div>
                <h3>Log out</h3>
                <p>Are you sure you want to log out from Sports?</p>
              </div>
            </div>

            <div className="sports-logout-modal-actions">
              <button
                className="sports-logout-cancel-btn"
                onClick={closeLogoutConfirm}
              >
                Cancel
              </button>
              <button
                className="sports-logout-confirm-btn"
                onClick={confirmLogout}
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}     
    </>
  );
};

export default Navbar;