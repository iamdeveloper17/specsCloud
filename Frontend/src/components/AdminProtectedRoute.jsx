// src/components/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />; // 🔥 Kick normal user from admin pages
  }

  return children;
};

export default AdminProtectedRoute;