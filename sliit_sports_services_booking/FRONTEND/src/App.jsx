import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import FacilityListPage from './pages/FacilityListPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminSlotsPage from './pages/AdminSlotsPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminLimitsPage from './pages/AdminLimitsPage';
import AdminPriorityReviewPage from './pages/AdminPriorityReviewPage';
import AdminOccupancyDashboard from './pages/AdminOccupancyDashboard';

/* Protected route: must be logged in */
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/* Admin-only route */
const RequireAdmin = ({ children }) => {
  const { user } = useAuth();
  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

/* Layout with Navbar */
const WithNavbar = ({ children }) => (
  <div className="app-layout">
    <Navbar />
    <main className="main-content">
      {children}
    </main>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginPage />} />

      {/* Student Routes */}
      <Route path="/home" element={
        <RequireAuth>
          <WithNavbar><HomePage /></WithNavbar>
        </RequireAuth>
      } />

      <Route path="/book/category" element={
        <RequireAuth>
          <WithNavbar><HomePage /></WithNavbar>
        </RequireAuth>
      } />

      <Route path="/book/:type" element={
        <RequireAuth>
          <WithNavbar><FacilityListPage /></WithNavbar>
        </RequireAuth>
      } />

      <Route path="/book/:type/:id" element={
        <RequireAuth>
          <WithNavbar><BookingPage /></WithNavbar>
        </RequireAuth>
      } />

      <Route path="/my-bookings" element={
        <RequireAuth>
          <WithNavbar><MyBookingsPage /></WithNavbar>
        </RequireAuth>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <RequireAuth>
          <RequireAdmin>
            <WithNavbar><AdminDashboard /></WithNavbar>
          </RequireAdmin>
        </RequireAuth>
      } />

      <Route path="/admin/bookings" element={
        <RequireAuth>
          <RequireAdmin>
            <WithNavbar><AdminBookingsPage /></WithNavbar>
          </RequireAdmin>
        </RequireAuth>
      } />

      <Route path="/admin/slots" element={
        <RequireAuth>
          <RequireAdmin>
            <WithNavbar><AdminSlotsPage /></WithNavbar>
          </RequireAdmin>
        </RequireAuth>
      } />

      <Route path="/admin/reports" element={
        <RequireAuth>
          <RequireAdmin>
            <WithNavbar><AdminReportsPage /></WithNavbar>
          </RequireAdmin>
        </RequireAuth>
      } />

      <Route path="/admin/limits" element={
        <RequireAuth>
          <RequireAdmin>
            <WithNavbar><AdminLimitsPage /></WithNavbar>
          </RequireAdmin>
        </RequireAuth>
      } />

      <Route path="/admin/priority" element={
        <RequireAuth>
          <RequireAdmin>
            <WithNavbar><AdminPriorityReviewPage /></WithNavbar>
          </RequireAdmin>
        </RequireAuth>
      } />

      <Route path="/admin/occupancy" element={
        <RequireAuth>
          <RequireAdmin>
            <WithNavbar><AdminOccupancyDashboard /></WithNavbar>
          </RequireAdmin>
        </RequireAuth>
      } />

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
