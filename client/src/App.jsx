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

import SportsLayout from './components/sports/SportsLayout'
import SportsManagerRouteGuard from './components/SportsManagerRouteGuard'
import SportsHomePage from './pages/sports/HomePage'
import SportsFacilityListPage from './pages/sports/FacilityListPage'
import SportsBookingPage from './pages/sports/BookingPage'
import SportsMyBookingsPage from './pages/sports/MyBookingsPage'
import SportsAdminDashboardPage from './pages/sports/AdminDashboard'
import SportsAdminFacilityManagementPage from './pages/sports/AdminFacilityManagementPage'
import SportsAdminBookingsPage from './pages/sports/AdminBookingsPage'
import SportsAdminSlotsPage from './pages/sports/AdminSlotsPage'
import SportsAdminReportsPage from './pages/sports/AdminReportsPage'
import SportsAdminLimitsPage from './pages/sports/AdminLimitsPage'
import SportsAdminPriorityReviewPage from './pages/sports/AdminPriorityReviewPage'
import SportsAdminOccupancyDashboardPage from './pages/sports/AdminOccupancyDashboard'


import ClubsPage from './pages/clubs/ClubsPage'
import ClubsAuthPage from './pages/clubs/ClubsAuthPage'
import ClubAdvisorPage from './pages/clubs/ClubAdvisorPage'
import ClubChatbotPage from './pages/clubs/ClubChatbotPage'
import MyApplicationsPage from './pages/clubs/MyApplicationsPage'
import ClubsAdminDashboardPage from './pages/clubs/admin/AdminDashboard'

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
          path="/clubs"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ClubsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clubs/advisor"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ClubAdvisorPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clubs/chat"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ClubChatbotPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clubs/my-applications"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clubs/auth"
          element={<ClubsAuthPage />}
        />

        <Route
          path="/clubs/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ClubsAdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route element={<SportsLayout />}>
          <Route
            path="/sports"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <SportsHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sports/book/facilities"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <SportsFacilityListPage type="sport" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sports/book/services"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <SportsFacilityListPage type="service" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sports/book/:type/:id"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <SportsBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sports/my-bookings"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <SportsMyBookingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

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

        <Route element={<SportsManagerRouteGuard />}>
          <Route element={<SportsLayout />}>
            <Route path="/sports/admin" element={<SportsAdminDashboardPage />} />
            <Route path="/sports/admin/facilities" element={<SportsAdminFacilityManagementPage />} />
            <Route path="/sports/admin/bookings" element={<SportsAdminBookingsPage />} />
            <Route path="/sports/admin/slots" element={<SportsAdminSlotsPage />} />
            <Route path="/sports/admin/reports" element={<SportsAdminReportsPage />} />
            <Route path="/sports/admin/limits" element={<SportsAdminLimitsPage />} />
            <Route path="/sports/admin/priority" element={<SportsAdminPriorityReviewPage />} />
            <Route path="/sports/admin/occupancy" element={<SportsAdminOccupancyDashboardPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App