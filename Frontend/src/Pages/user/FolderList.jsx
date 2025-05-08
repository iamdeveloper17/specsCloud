import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FolderList = () => {
  const [folders, setFolders] = useState([]);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');

  const fetchFolders = async () => {
    try {
      const res = await axios.get('https://specscloud-1.onrender.com/api/catalogue/folders');
      setFolders(res.data);
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to fetch folders');
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleRename = async (oldName) => {
    if (!newFolderName.trim()) {
      toast.error('Folder name cannot be empty');
      return;
    }
    try {
      await axios.put(`https://specscloud-1.onrender.com/api/catalogue/folders/${encodeURIComponent(oldName)}`, {
        newFolderName,
      });
      toast.success('Folder renamed successfully');
      setEditingFolder(null);
      setNewFolderName('');
      fetchFolders();
    } catch (error) {
      console.error(error.message);
      toast.error('Rename folder failed');
    }
  };

  const handleDelete = async (folderName) => {
    if (!window.confirm(`Are you sure you want to delete folder "${folderName}" and all its files?`)) return;
    try {
      await axios.delete(`https://specscloud-1.onrender.com/api/catalogue/folders/${encodeURIComponent(folderName)}`);
      toast.success('Folder deleted successfully');
      fetchFolders();
    } catch (error) {
      console.error(error.message);
      toast.error('Delete folder failed');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Folders Management</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Folder Name</th>
              <th className="py-2 px-4 text-left">Number of Files</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {folders.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-500">No folders found!</td>
              </tr>
            ) : (
              folders.map((folder) => (
                <tr key={folder._id || folder.folderName} className="border-b">
                  <td className="py-2 px-4">
                    {editingFolder === folder._id ? (
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      folder._id || 'No Name'
                    )}
                  </td>
                  <td className="py-2 px-4">{folder.fileCount}</td>
                  <td className="py-2 px-4 space-x-2">
                    {editingFolder === folder._id ? (
                      <>
                        <button
                          onClick={() => handleRename(folder._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingFolder(null); setNewFolderName(''); }}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditingFolder(folder._id); setNewFolderName(folder._id); }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(folder._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FolderList;