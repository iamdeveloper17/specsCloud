// src/components/AdminSidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaFolderOpen, FaUser, FaSignOutAlt } from 'react-icons/fa';
import logo from '../images/logo.png';

const AdminSidebar = ({ onClose }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/admin-dashboard' },
    { name: 'Catalogue', icon: <FaFolderOpen />, path: '/admin-catalogue' },
    { name: 'Manage Users', icon: <FaUser />, path: '/admin-users' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="w-64 min-h-screen bg-gray-300 text-white flex flex-col justify-between">
      {/* Top Logo */}
      <div>
        <div className="flex items-center justify-center px-4 py-3">
          <img src={logo} alt="Logo" className="w-28" />
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition text-indigo-700 ${
                  isActive ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-700 hover:text-white'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-white"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;