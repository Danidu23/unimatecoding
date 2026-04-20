import { Outlet } from 'react-router-dom';
import { useMemo } from 'react';
import Navbar from './Navbar';

const SportsLayout = () => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);

  return (
    <div className="sports-theme">
      <div className="app-layout">
        <Navbar user={user} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SportsLayout;