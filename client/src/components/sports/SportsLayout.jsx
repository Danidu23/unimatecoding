import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const SportsLayout = () => {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
};

export default SportsLayout;