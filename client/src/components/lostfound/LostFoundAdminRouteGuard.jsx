import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function LostFoundAdminRouteGuard() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  if (!token || !userRaw) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const permissions = Array.isArray(user?.permissions)
    ? user.permissions
    : typeof user?.permissions === 'string'
      ? [user.permissions]
      : [];

  const isLostFoundAdmin =
    user?.role === 'admin' &&
    permissions.includes('lostfound_admin');

  if (!isLostFoundAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}