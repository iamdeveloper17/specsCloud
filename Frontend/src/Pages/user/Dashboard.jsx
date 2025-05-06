// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Assuming you have stored user name during login
    const name = localStorage.getItem('userName') || 'User'; // fallback if not found
    setUserName(name);
  }, []);

  return (
    <div className="p-6 sm:p-10 min-h-[100vh] bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Page Title */}
      <h2 className="text-4xl font-extrabold text-indigo-800 mb-6 text-center">
        Welcome, {userName} 👋
      </h2>

      {/* Beautiful Welcome Message */}
      <p className="text-center text-lg text-gray-700 max-w-2xl mx-auto mb-8">
        This is your personal dashboard. Here, you can easily upload, view, and manage your catalog files. 
        Stay organized, track your activity, and make the most out of your SpecsCloud experience!
      </p>

      {/* Quick Tips Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-purple-700 mb-4">Quick Tips 💡</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>📂 Upload your catalog files easily under the "Catalogue" tab.</li>
          <li>🔍 Quickly view and download your uploaded files anytime.</li>
          <li>🛡️ Your data is secure and accessible only by you.</li>
          <li>🚀 Stay tuned for new features and improvements!</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
