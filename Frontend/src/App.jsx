// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import FrontPage from "./login/FrontPage";
import Signup from "./login/Signup";
import Login from "./login/Login";

// Layouts
import UserMainLayout from "./layout/UserMainLayout";
import AdminMainLayout from "./layout/AdminMainLayout";

// User Pages
import Dashboard from "./Pages/user/Dashboard";
import Catalogue from "./Pages/user/Catalogue";

// Admin Pages
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminCatalogue from "./Pages/admin/AdminCatalogue";
import AdminUser from "./Pages/admin/AdminUser";

// Route Guards
import PublicRoute from "./components/PublicRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Specification from "./Pages/user/Specification";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><FrontPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* User Layout Routes */}
        <Route path="/" element={<UserProtectedRoute><UserMainLayout /></UserProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="catalogue" element={<Catalogue />} />
          <Route path="specification" element={<Specification />} />
        </Route>

        {/* Admin Layout Routes */}
        <Route path="/" element={<AdminProtectedRoute><AdminMainLayout /></AdminProtectedRoute>}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="admin-catalogue" element={<AdminCatalogue />} />
          <Route path="admin-users" element={<AdminUser />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>

      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
