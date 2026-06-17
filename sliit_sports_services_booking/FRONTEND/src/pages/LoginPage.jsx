import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './LoginPage.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin' || user.role === 'staff') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (preset) => {
    setEmail(preset.email);
    setPassword('password123');
  };

  return (
    <div className="login-page">
      {/* Background blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">U</div>
          <div>
            <h1 className="login-brand">UniMate</h1>
            <p className="login-tagline">Sports & Services Booking</p>
          </div>
        </div>

        <div className="login-divider" />

        <h2 className="login-title">Welcome back</h2>
        <p className="login-subtitle">Sign in to your SLIIT account to continue</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrap">
              <FiMail className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="you@sliit.lk"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <FiLock className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                className="input-eye-btn"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg login-submit-btn"
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : null}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="login-quick-access">
          <p className="login-quick-label">Quick Demo Access</p>
          <div className="login-quick-buttons">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => quickLogin({ email: 'kaveesha@sliit.lk' })}
            >
              🎓 Student
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => quickLogin({ email: 'admin@sliit.lk' })}
            >
              🔧 Admin
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => quickLogin({ email: 'staff@sliit.lk' })}
            >
              👤 Staff
            </button>
          </div>
          <p className="login-hint">Password: <code>password123</code></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
