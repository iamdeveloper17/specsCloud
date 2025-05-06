// src/pages/admin/AdminUser.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminUser = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://specscloud-1.onrender.com/api/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to fetch users');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`https://specscloud-1.onrender.com/api/admin/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers(); // Refresh
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Manage Users</h2>

      <div className="overflow-x-auto">
        {/* Scrollable box just like Admin Catalogue */}
        <div className="max-h-[600px] overflow-y-auto border border-gray-300 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-indigo-600 text-white sticky top-0 z-10">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-center">Total Files</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4 text-center">{user.totalFiles}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUser;
