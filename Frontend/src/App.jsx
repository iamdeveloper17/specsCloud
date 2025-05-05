// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FrontPage from "./login/FrontPage";
import Signup from "./login/Signup";
import Login from "./login/Login";
import MainLayout from "./layout/MainLayout";
import DashBoard from "./Pages/DashBoard"
import User from "./Pages/User"
import Catalogue from "./Pages/Catalogue"

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<FrontPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Layout with Nested Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="users" element={<User />} />
          <Route path="catalogue" element={<Catalogue />} />
        </Route>
        
        {/* Optional: 404 Not Found */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
