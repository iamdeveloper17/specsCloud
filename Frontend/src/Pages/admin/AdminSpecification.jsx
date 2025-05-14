import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const categoryOptions = ['Rehab', 'Critical Care', 'Medical Education', 'Simulation', 'Anatomy', 'Medication'];

const formatFileType = (type = '') => {
  if (type.includes('word')) return 'Word Document';
  if (type.includes('presentation')) return 'PowerPoint';
  if (type.includes('spreadsheet')) return 'Excel Sheet';
  if (type.includes('pdf')) return 'PDF';
  if (type.includes('image')) return 'Image';
  return type;
};

const AdminSpecification = () => {
  const [files, setFiles] = useState([]);
  const [viewCategory, setViewCategory] = useState('All');
  const navigate = useNavigate();

  const fetchAllFiles = async () => {
    try {
      const res = await axios.get('https://specscloud-1.onrender.com/api/specification/files');
      setFiles(res.data);
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to fetch files');
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const res = await axios.get(`https://specscloud-1.onrender.com/api/specification/download/${id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started');
    } catch (error) {
      console.error(error.message);
      toast.error('Download failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await axios.delete(`https://specscloud-1.onrender.com/api/specification/delete/${id}`);
      toast.success('File deleted successfully');
      fetchAllFiles();
    } catch (error) {
      console.error(error.message);
      toast.error('Delete failed');
    }
  };

  const handleView = (file) => {
    navigate('/view-file', { state: { file } });
  };

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const filteredFiles = viewCategory === 'All'
    ? files
    : files.filter(file => file.category === viewCategory);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">All Uploaded Specification Files (Admin View)</h2>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setViewCategory('All')}
          className={`px-4 py-2 rounded-full border ${viewCategory === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
        >
          All
        </button>
        {categoryOptions.map(cat => (
          <button
            key={cat}
            onClick={() => setViewCategory(cat)}
            className={`px-4 py-2 rounded-full border ${viewCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block max-h-[500px] overflow-y-auto border border-gray-300 rounded">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-indigo-600 text-white sticky top-0 z-10">
            <tr>
              <th className="py-2 px-4 text-left">S.No.</th>
              <th className="py-2 px-4 text-left">File</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Size (KB)</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No specification files uploaded yet!
                </td>
              </tr>
            ) : (
              filteredFiles.map((file, index) => (
                <tr key={file._id} className="border-b">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4 max-w-xs truncate" title={file.fileName}>{file.fileName}</td>
                  <td className="py-2 px-4">{file.category || 'N/A'}</td>
                  <td className="py-2 px-4 max-w-[240px] truncate" title={file.fileType}>
                    {formatFileType(file.fileType)}
                  </td>
                  <td className="py-2 px-4">{(file.fileSize / 1024).toFixed(2)}</td>
                  <td className="py-2 px-4 flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <button onClick={() => handleView(file)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs">View</button>
                    <button onClick={() => handleDownload(file._id, file.fileName)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs">Download</button>
                    <button onClick={() => handleDelete(file._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4 mt-4">
        {filteredFiles.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No specification files uploaded yet!</p>
        ) : (
          filteredFiles.map((file, index) => (
            <div key={file._id} className="border rounded p-4 shadow text-sm bg-white">
              <p><strong>📌 S.No.:</strong> {index + 1}</p>
              <p><strong>📄 File:</strong> {file.fileName}</p>
              <p><strong>🏷️ Category:</strong> {file.category || 'N/A'}</p>
              <p><strong>📌 Type:</strong> {formatFileType(file.fileType)}</p>
              <p><strong>📦 Size:</strong> {(file.fileSize / 1024).toFixed(2)} KB</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button onClick={() => handleView(file)} className="bg-blue-500 text-white px-3 py-1 rounded text-xs">View</button>
                <button onClick={() => handleDownload(file._id, file.fileName)} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">Download</button>
                <button onClick={() => handleDelete(file._id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminSpecification;
