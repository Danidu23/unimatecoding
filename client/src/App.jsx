import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Canteenpage from './pages/Canteenpage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import StaffOrdersPage from './pages/StaffOrdersPage'
import StaffMenuPage from './pages/StaffMenuPage'
import StaffHomePage from "./pages/StaffHomePage";
import LostFoundHomePage from './pages/lostfound/LostFoundHomePage'
import ReportLostItemPage from './pages/lostfound/ReportLostItemPage'
import ReportFoundItemPage from './pages/lostfound/ReportFoundItemPage'
import BrowseLostFoundItemsPage from './pages/lostfound/BrowseLostFoundItemsPage'
import LostFoundItemDetailsPage from './pages/lostfound/LostFoundItemDetailsPage'
import ClaimLostFoundItemPage from './pages/lostfound/ClaimLostFoundItemPage'
import MyLostFoundReportsPage from './pages/lostfound/MyLostFoundReportsPage'
import LostFoundMessagesPage from './pages/lostfound/LostFoundMessagesPage'
import LostFoundSubmissionSuccessPage from './pages/lostfound/LostFoundSubmissionSuccessPage'
import LostFoundAdminLoginPage from './pages/lostfound/LostFoundAdminLoginPage'
import LostFoundAdminDashboardPage from './pages/lostfound/LostFoundAdminDashboardPage'
import LostFoundLayout from './components/lostfound/LostFoundLayout'
import LostFoundAdminRouteGuard from './components/lostfound/LostFoundAdminRouteGuard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/canteen"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Canteenpage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffHomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/menu"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffMenuPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/orders"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffOrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lost-found"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <LostFoundLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<LostFoundHomePage />} />
          <Route path="report-lost" element={<ReportLostItemPage />} />
          <Route path="report-found" element={<ReportFoundItemPage />} />
          <Route path="browse" element={<BrowseLostFoundItemsPage />} />
          <Route path="item/:id" element={<LostFoundItemDetailsPage />} />
          <Route path="claim/:id" element={<ClaimLostFoundItemPage />} />
          <Route path="my-reports" element={<MyLostFoundReportsPage />} />
          <Route path="messages" element={<LostFoundMessagesPage />} />
          <Route path="submission-success" element={<LostFoundSubmissionSuccessPage />} />
        </Route>

        <Route path="/lost-found/admin-login" element={<LostFoundAdminLoginPage />} />

        <Route element={<LostFoundAdminRouteGuard />}>
          <Route path="/lost-found/admin" element={<LostFoundAdminDashboardPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App