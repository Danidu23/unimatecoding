import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const SportsLayout = () => {
  return (
    <div className="sports-theme">
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SportsLayout;