// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import FrontPage from "./login/FrontPage";
import Signup from "./login/Signup";
import Login from "./login/Login";
import MainLayout from "./layout/MainLayout";

// User Pages
import DashBoard from "./Pages/user/Dashboard";
import Catalogue from "./Pages/user/Catalogue";

// Admin Pages
import AdminCatalogue from "./Pages/admin/AdminCatalogue";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminUser from "./Pages/admin/AdminUser";

// Guards
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminRoute from "./components/AdminRoute"; // 👈 Import this

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><FrontPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* Main Layout (Sidebar + Topbar) */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* User Routes */}
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="catalogue" element={<Catalogue />} />

          {/* Admin Routes */}
          <Route path="admin-dashboard" element={
            <AdminRoute><AdminDashboard /></AdminRoute> // 👈 Correct Admin Guard
          } />
          <Route path="admin-catalogue" element={
            <AdminRoute><AdminCatalogue /></AdminRoute> // 👈
          } />
          <Route path="admin-users" element={
            <AdminRoute><AdminUser /></AdminRoute> // 👈
          } />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>

      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
