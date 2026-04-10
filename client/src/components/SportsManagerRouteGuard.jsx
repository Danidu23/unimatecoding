import { Navigate, Outlet } from 'react-router-dom';

function SportsManagerRouteGuard() {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role === 'admin';
  const isSportsStaff = user.role === 'staff' && user.staffType === 'sports';

  if (!isAdmin && !isSportsStaff) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default SportsManagerRouteGuard;