// src/components/UserProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin-dashboard" replace />; // 🔥 Kick admin out from user pages
  }

  return children;
};

export default UserProtectedRoute;
