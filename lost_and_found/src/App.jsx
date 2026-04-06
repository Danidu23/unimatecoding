import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ReportLostItem from './pages/ReportLostItem';
import ReportFoundItem from './pages/ReportFoundItem';
import BrowseItems from './pages/BrowseItems';
import ItemDetails from './pages/ItemDetails';
import ClaimItem from './pages/ClaimItem';
import MyReports from './pages/MyReports';
import SubmissionSuccess from './pages/SubmissionSuccess';
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#e2e8f0',
          border: '1px solid #334155'
        }
      }} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="report-lost" element={<ReportLostItem />} />
          <Route path="report-found" element={<ReportFoundItem />} />
          <Route path="browse" element={<BrowseItems />} />
          <Route path="item/:id" element={<ItemDetails />} />
          <Route path="claim/:id" element={<ClaimItem />} />
          <Route path="my-reports" element={<MyReports />} />
          <Route path="messages" element={<Messages />} />
          <Route path="submission-success" element={<SubmissionSuccess />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin-login" element={<AdminLogin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
