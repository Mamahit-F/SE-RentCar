import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner text="Memeriksa sesi pengguna..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Role unauthorized -> redirect to appropriate dashboard
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'PARTNER') return <Navigate to="/partner/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
