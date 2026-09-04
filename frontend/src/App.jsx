import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import RentalListPage from './pages/public/RentalListPage';
import RentalDetailPage from './pages/public/RentalDetailPage';
import CarDetailPage from './pages/public/CarDetailPage';

// User Pages
import MyBookingsPage from './pages/user/MyBookingsPage';
import UserProfilePage from './pages/user/UserProfilePage';

// Partner Pages
import PartnerDashboardPage from './pages/partner/PartnerDashboardPage';
import PartnerRentalPage from './pages/partner/PartnerRentalPage';
import PartnerCarsPage from './pages/partner/PartnerCarsPage';
import PartnerBookingsPage from './pages/partner/PartnerBookingsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminRentalsPage from './pages/admin/AdminRentalsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-warm text-ink-primary flex flex-col selection:bg-lime selection:text-ink-primary font-sans antialiased">
          <Navbar />
          
          <div className="flex-1 w-full">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/rentals" element={<RentalListPage />} />
              <Route path="/rentals/:id" element={<RentalDetailPage />} />
              <Route path="/cars" element={<RentalListPage />} />
              <Route path="/cars/:id" element={<CarDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Customer / User Protected Routes */}
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'PARTNER']}>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['USER', 'PARTNER', 'ADMIN']}>
                    <UserProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Partner Protected Routes */}
              <Route
                path="/partner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['PARTNER']}>
                    <PartnerDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/partner/rental"
                element={
                  <ProtectedRoute allowedRoles={['PARTNER']}>
                    <PartnerRentalPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/partner/cars"
                element={
                  <ProtectedRoute allowedRoles={['PARTNER']}>
                    <PartnerCarsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/partner/bookings"
                element={
                  <ProtectedRoute allowedRoles={['PARTNER']}>
                    <PartnerBookingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/applications"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/rentals"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminRentalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminBookingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
