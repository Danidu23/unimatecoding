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
  const isSportsAdmin =
    user?.role === 'admin' &&
    user?.permissions?.includes('sports_admin');

  if (!isSportsAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default SportsManagerRouteGuard;