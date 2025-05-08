import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FolderList = () => {
  const [folders, setFolders] = useState([]);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState([]); // 🔥 New: track expanded folders

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

  const toggleExpand = (folderId) => {
    if (expandedFolders.includes(folderId)) {
      setExpandedFolders(expandedFolders.filter((id) => id !== folderId));
    } else {
      setExpandedFolders([...expandedFolders, folderId]);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-6">
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
                <React.Fragment key={folder._id || Math.random()}>
                  <tr className="border-b">
                    <td className="py-2 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleExpand(folder._id)}
                            className="focus:outline-none"
                          >
                            {expandedFolders.includes(folder._id) ? '🔽' : '▶️'}
                          </button>
                          {editingFolder === folder._id ? (
                            <input
                              type="text"
                              value={newFolderName}
                              onChange={(e) => setNewFolderName(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1"
                            />
                          ) : (
                            <span>{folder._id || 'No Name'}</span>
                          )}
                        </div>
                      </div>
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

                  {/* Expanded: show files inside */}
                  {expandedFolders.includes(folder._id) && (
                    <tr>
                      <td colSpan="3" className="bg-gray-50">
                        <div className="p-4 space-y-2">
                          {folder.files.length === 0 ? (
                            <p className="text-gray-500">No files inside this folder.</p>
                          ) : (
                            folder.files.map((file) => (
                              <div key={file._id} className="flex items-center justify-between border-b pb-2">
                                <span>{file.fileName}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FolderList;
