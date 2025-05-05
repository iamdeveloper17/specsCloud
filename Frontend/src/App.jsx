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
import AdminCatalogue from "./Pages/admin/AdminCatalogue";  // 🛑 Create this page
import AdminDashboard from "./Pages/admin/AdminDashboard";  // 🛑 Create this page
import AdminUser from "./Pages/admin/AdminUser";  // 🛑 Create this page (Manage users)

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<FrontPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Main Layout (Sidebar + Topbar) */}
        <Route path="/" element={<MainLayout />}>
          {/* User Routes */}
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="catalogue" element={<Catalogue />} />

          {/* Admin Routes */}
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="admin-catalogue" element={<AdminCatalogue />} />
          <Route path="admin-users" element={<AdminUser />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>

      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
