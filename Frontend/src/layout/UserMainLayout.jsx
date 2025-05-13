// src/layout/UserMainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaBars } from 'react-icons/fa';

const UserMainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
<div className="flex min-h-screen w-full relative bg-gray-100 overflow-x-hidden overflow-y-auto">


      {/* Hamburger icon (mobile only) */}
      <div className="sm:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-white border rounded-lg shadow-md">

        <button
          onClick={() => setSidebarOpen(true)}
          className="text-indigo-700"
        >
          <FaBars />
        </button>
      </div>


      {/* Sidebar - slides in on mobile */}
      <div
        className={`fixed sm:static z-50 h-full transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0`}
      >
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* 🟣 Overlay to close sidebar on outside click (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 sm:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 pt-20 sm:pt-4 px-4 pb-8 bg-gradient-to-br from-indigo-50 to-purple-100 z-10 overflow-x-hidden">
        <Outlet />
      </main>

    </div>
  );
};

export default UserMainLayout;
