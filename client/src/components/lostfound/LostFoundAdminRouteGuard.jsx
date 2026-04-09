import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAdminAuthenticated } from '../../utils/lostfound/sessionUser';

export default function LostFoundAdminRouteGuard() {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return <Navigate to='/lost-found/admin-login' replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
