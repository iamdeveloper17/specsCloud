import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FolderList = () => {
  const [folders, setFolders] = useState([]);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState([]);

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

  const toggleExpand = (folderId) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleRenameFolder = async (oldName) => {
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

  const handleDeleteFolder = async (folderName) => {
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

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const res = await axios.get(`https://specscloud-1.onrender.com/api/catalogue/download/${fileId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started');
    } catch (error) {
      console.error(error.message);
      toast.error('Download failed');
    }
  };

  const handleEditFileName = async (fileId) => {
    const newName = prompt('Enter new file name:');
    if (!newName) return;
    try {
      await axios.put(`https://specscloud-1.onrender.com/api/catalogue/rename/${fileId}`, { newName });
      toast.success('File renamed successfully');
      fetchFolders();
    } catch (error) {
      console.error(error.message);
      toast.error('Rename failed');
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await axios.delete(`https://specscloud-1.onrender.com/api/catalogue/delete/${fileId}`);
      toast.success('File deleted successfully');
      fetchFolders();
    } catch (error) {
      console.error(error.message);
      toast.error('Delete failed');
    }
  };

  const handleViewFile = async (fileId) => {
    try {
      const res = await axios.get(`https://specscloud-1.onrender.com/api/catalogue/download/${fileId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      window.open(url, '_blank');
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to view file');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Folders Management</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Folder Name</th>
              <th className="py-2 px-4 text-left">Number of Files</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {folders.map(folder => (
              <React.Fragment key={folder._id}>
                <tr className="border-b">
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleExpand(folder._id)} className="focus:outline-none">
                        {expandedFolders.includes(folder._id) ? <FaChevronDown /> : <FaChevronRight />}
                      </button>
                      {editingFolder === folder._id ? (
                        <input
                          type="text"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        <span>{folder._id}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4">{folder.fileCount}</td>
                  <td className="py-2 px-4 space-x-2">
                    {editingFolder === folder._id ? (
                      <>
                        <button onClick={() => handleRenameFolder(folder._id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Save</button>
                        <button onClick={() => { setEditingFolder(null); setNewFolderName(''); }} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingFolder(folder._id); setNewFolderName(folder._id); }} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                        <button onClick={() => handleDeleteFolder(folder._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                      </>
                    )}
                  </td>
                </tr>

                {/* Expand Files */}
                {expandedFolders.includes(folder._id) && (
                  <tr>
                    <td colSpan="3" className="bg-gray-50">
                      <div className="p-4 space-y-3">
                        {folder.files.map(file => (
                          <div key={file._id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded px-4 py-2 shadow-sm">
                            <div>
                              <div className="font-semibold text-gray-800">{file.fileName}</div>
                              <div className="text-xs text-gray-500">
                                Type: 
                                <span className={`ml-1 px-2 py-1 rounded-full text-white ${file.source === 'Catalogue' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                                  {file.source}
                                </span> 
                                | Category: {file.category || 'N/A'}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2 md:mt-0">
                              <button onClick={() => handleViewFile(file._id)} className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600">View</button>
                              <button onClick={() => handleDownloadFile(file._id, file.fileName)} className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600">Download</button>
                              <button onClick={() => handleEditFileName(file._id)} className="bg-yellow-400 text-white text-xs px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
                              <button onClick={() => handleDeleteFile(file._id)} className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FolderList;
