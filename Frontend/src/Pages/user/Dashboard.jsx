// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'User';
    setUserName(name);
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-6 md:p-10 flex flex-col items-center">
      
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-indigo-800 mb-4 text-center">
        Welcome, {userName} 👋
      </h1>

      {/* Subheading */}
      <p className="text-center text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mb-8 px-4">
        This is your personal dashboard. Easily upload, view, and manage your catalog and specification files.
        Stay organized, track your uploads, and get the most out of your SpecsCloud experience.
      </p>

      {/* Quick Tips Card */}
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 sm:p-8 transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-4">Quick Tips 💡</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm sm:text-base leading-relaxed">
          <li>📂 Use the <strong>"Catalogue"</strong> or <strong>"Specification"</strong> tab to upload and manage files.</li>
          <li>🔍 You can preview PDFs and images directly in your browser.</li>
          <li>📝 Use the rename feature to better organize your files.</li>
          <li>🛡️ Your uploads are private and secure—only visible to your account.</li>
          <li>🚀 New features are on the way—keep checking back!</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;