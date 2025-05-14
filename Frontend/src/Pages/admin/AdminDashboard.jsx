import React from "react";

const AdminDashboard = () => {
  return (
    <div className="p-6 sm:p-10">
      {/* Page Title */}
      <h2 className="text-4xl font-extrabold text-indigo-800 mb-8 text-center">
        Admin Dashboard
      </h2>

      {/* Welcome Message */}
      <p className="text-center text-lg text-gray-700 mb-10">
        Welcome to your Admin Panel! Here you can monitor users, manage files, and control system settings.
      </p>
    </div>
  );
};

export default AdminDashboard;
