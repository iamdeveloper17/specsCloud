// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaFolderOpen, FaSignOutAlt } from 'react-icons/fa'; // ✨ No user icon here
import logo from '../images/logo.png';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
    { name: 'Catalogue', icon: <FaFolderOpen />, path: '/catalogue' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="w-64 min-h-screen bg-zinc-300 text-white flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center px-4 py-3">
          <img src={logo} alt="Logo" className="w-28" />
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition text-indigo-700 ${
                  isActive ? 'bg-indigo-600' : 'hover:bg-indigo-700'
                } ${isActive ? 'text-white' : 'hover:text-white'}`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

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

export default Sidebar;
