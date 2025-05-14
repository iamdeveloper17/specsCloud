// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaFolderOpen, FaSignOutAlt, FaFileAlt, FaFolder } from 'react-icons/fa';
import logo from '../images/logo.png';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
    { name: 'Catalogue', icon: <FaFolderOpen />, path: '/catalogue' },
    { name: 'Specification', icon: <FaFileAlt />, path: '/specification' },
    // { name: 'Folder', icon: <FaFolder />, path: '/folder' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
<aside className="h-full sm:min-h-screen w-full max-w-xs sm:w-64 bg-zinc-300 text-white flex flex-col justify-between shadow-lg">
  {/* Logo */}
  <div>
    <div className="flex items-center justify-center px-4 py-4 shadow-inner">
      <img src={logo} alt="Logo" className="w-24 sm:w-28" />
    </div>

    {/* Nav */}
    <nav className="p-4 space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-800 hover:bg-indigo-700 hover:text-white'
            }`
          }
        >
          <span className="mr-3 text-lg">{item.icon}</span>
          <span className="text-sm sm:text-base">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  </div>

  {/* Logout */}
  <div className="p-4">
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-sm sm:text-base font-medium"
    >
      <FaSignOutAlt className="mr-2" />
      Logout
    </button>
  </div>
</aside>
  );
};

export default Sidebar;
