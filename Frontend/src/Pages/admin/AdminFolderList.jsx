import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminFolderList = () => {
  const [folders, setFolders] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameFileId, setRenameFileId] = useState(null);
  const [renameFileName, setRenameFileName] = useState('');
  const [renameFileSource, setRenameFileSource] = useState('');
  const navigate = useNavigate();

  const fetchFolders = async () => {
    try {
      const [catalogueRes, specificationRes] = await Promise.all([
        axios.get('https://specscloud-1.onrender.com/api/catalogue/folders', { params: { isAdmin: true } }),
        axios.get('https://specscloud-1.onrender.com/api/specification/folders', { params: { isAdmin: true } })
      ]);


      const mergedFolders = {};

      catalogueRes.data.forEach(folder => {
        if (!mergedFolders[folder._id]) {
          mergedFolders[folder._id] = { ...folder, files: [] };
        }
        mergedFolders[folder._id].files.push(...folder.files.map(file => ({ ...file, source: 'catalogue' })));
      });

      specificationRes.data.forEach(folder => {
        if (!mergedFolders[folder._id]) {
          mergedFolders[folder._id] = { _id: folder._id, fileCount: 0, files: [] };
        }
        mergedFolders[folder._id].files.push(...folder.files.map(file => ({ ...file, source: 'specification' })));
      });

      const finalFolders = Object.values(mergedFolders).map(folder => ({
        ...folder,
        fileCount: folder.files.length,
      }));

      setFolders(finalFolders);
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to fetch folders');
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const toggleExpand = folderId => {
    setExpandedFolders(prev =>
      prev.includes(folderId) ? prev.filter(id => id !== folderId) : [...prev, folderId]
    );
  };

  const handleViewFile = (file) => {
    navigate('/view-file', { state: { file } });
  };

  const handleDownloadFile = async file => {
    const baseApi = file.source === 'specification' ? 'specification' : 'catalogue';
    try {
      const res = await axios.get(`https://specscloud-1.onrender.com/api/${baseApi}/download/${file._id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started');
    } catch (error) {
      console.error(error.message);
      toast.error('Download failed');
    }
  };

  const handleDeleteFile = async file => {
    const baseApi = file.source === 'specification' ? 'specification' : 'catalogue';
    if (!window.confirm(`Are you sure you want to delete ${file.fileName}?`)) return;
    try {
      await axios.delete(`https://specscloud-1.onrender.com/api/${baseApi}/delete/${file._id}`);
      toast.success('File deleted successfully');
      fetchFolders();
    } catch (error) {
      console.error(error.message);
      toast.error('Delete failed');
    }
  };

  const openRenameModal = file => {
    setRenameFileId(file._id);
    setRenameFileName(file.fileName);
    setRenameFileSource(file.source);
    setIsRenameModalOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (!renameFileName.trim()) return toast.error('File name cannot be empty');
    try {
      await axios.put(`https://specscloud-1.onrender.com/api/${renameFileSource}/rename/${renameFileId}`, {
        newName: renameFileName,
      });
      toast.success('File renamed successfully');
      setIsRenameModalOpen(false);
      fetchFolders();
    } catch (error) {
      console.error(error.message);
      toast.error('Rename failed');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-0 sm:mt-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Admin Folders Management</h2>
      <div className="overflow-x-auto w-full">
        <div className="max-h-[590px] overflow-y-auto border border-gray-300 rounded">
          <table className="min-w-full table-fixed text-sm break-words">
            <thead className="bg-indigo-600 text-white sticky top-0 z-10">
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
                folders.map(folder => (
                  <React.Fragment key={folder._id}>
                    <tr className="border-b">
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleExpand(folder._id)} className="focus:outline-none">
                            {expandedFolders.includes(folder._id) ? <FaChevronDown className="text-indigo-600" /> : <FaChevronRight className="text-indigo-600" />}
                          </button>
                          <span>{folder._id || 'No Name'}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4">{folder.fileCount}</td>
                      <td className="py-2 px-4"></td>
                    </tr>
                    {expandedFolders.includes(folder._id) && (
                      <tr>
                        <td colSpan="3" className="bg-gray-50">
                          <div className="p-4 space-y-3">
                            {folder.files.length > 0 ? folder.files.map(file => (
                              <div
                                key={file._id}
                                className="flex flex-col sm:flex-row sm:items-start sm:justify-between bg-white rounded-lg p-4 shadow-sm w-full break-words space-y-2 sm:space-y-0 sm:space-x-4"
                              >
                                <div className="flex flex-col">
                                  <div className="break-words max-w-full w-full">
                                    <span className="font-medium text-gray-700 break-all">{file.fileName}</span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Type: <span className="font-semibold">{file.source || 'Catalogue'}</span> | Category: <span className="font-semibold">{file.category || 'N/A'}</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                                  <button onClick={() => handleViewFile(file)} className="bg-blue-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-600 transition">
                                    View
                                  </button>

                                  <button onClick={() => openRenameModal(file)} className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600">Rename</button>
                                  <button onClick={() => handleDownloadFile(file)} className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600">Download</button>
                                  <button onClick={() => handleDeleteFile(file)} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">Delete</button>
                                </div>
                              </div>
                            )) : (
                              <p className="text-gray-500">No files inside this folder.</p>
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
      {isRenameModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Rename File</h2>
            <input
              type="text"
              value={renameFileName}
              onChange={(e) => setRenameFileName(e.target.value)}
              className="border border-gray-300 rounded w-full px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsRenameModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
              <button onClick={handleRenameSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Rename</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFolderList;
