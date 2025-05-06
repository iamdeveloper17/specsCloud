// src/layout/AdminMainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminMainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminMainLayout;
