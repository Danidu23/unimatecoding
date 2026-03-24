import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Canteenpage from './pages/Canteenpage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
// Clubs & Societies Module
import ClubsAuthPage from './pages/ClubsAuthPage'
import ClubsPage from './pages/ClubsPage'
import ClubAdvisorPage from './pages/ClubAdvisorPage'
import ClubChatbotPage from './pages/ClubChatbotPage'
import MyApplicationsPage from './pages/MyApplicationsPage'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Existing UniMate routes */}
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/canteen"   element={<Canteenpage />} />
        <Route path="/profile"   element={<ProfilePage />} />

        {/* Clubs & Societies Module */}
        <Route path="/clubs/auth"            element={<ClubsAuthPage />} />
        <Route path="/clubs"                 element={<ClubsPage />} />
        <Route path="/clubs/advisor"         element={<ClubAdvisorPage />} />
        <Route path="/clubs/chat"            element={<ClubChatbotPage />} />
        <Route path="/clubs/my-applications" element={<MyApplicationsPage />} />
        <Route path="/clubs/admin"           element={<AdminDashboard />} />

        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App