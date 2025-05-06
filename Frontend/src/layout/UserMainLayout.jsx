// src/layout/AdminMainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar'; // Sidebar for Admin

const AdminMainLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminMainLayout;
