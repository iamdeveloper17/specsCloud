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
      fetchUsers();
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center sm:text-left">
        Manage Users
      </h2>

      {/* Desktop & Tablet Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <div className="max-h-[600px] overflow-y-auto border border-gray-300 rounded">
          <table className="min-w-full text-sm border-collapse">
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
                    <td className="py-2 px-4 truncate max-w-xs">{user.name}</td>
                    <td className="py-2 px-4 truncate max-w-xs">{user.email}</td>
                    <td className="py-2 px-4 text-center">{user.totalFiles}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
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

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {users.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No users found.</p>
        ) : (
          users.map((user) => (
            <div key={user._id} className="border rounded p-4 shadow text-sm bg-white">
              <p>
                <strong>👤 Name:</strong> {user.name}
              </p>
              <p>
                <strong>✉️ Email:</strong> {user.email}
              </p>
              <p>
                <strong>📁 Total Files:</strong> {user.totalFiles}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUser;
