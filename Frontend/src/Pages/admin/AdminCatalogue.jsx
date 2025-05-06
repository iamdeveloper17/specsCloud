import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminCatalogue = () => {
  const [files, setFiles] = useState([]);

  const fetchAllFiles = async () => {
    try {
      const res = await axios.get('https://specscloud-1.onrender.com/api/catalogue/files');
      setFiles(res.data);
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to fetch files');
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const res = await axios.get(`https://specscloud-1.onrender.com/api/catalogue/download/${id}`, {
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
      await axios.delete(`https://specscloud-1.onrender.com/api/catalogue/delete/${id}`);
      toast.success('File deleted successfully');
      fetchAllFiles();
    } catch (error) {
      console.error(error.message);
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchAllFiles();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">All Uploaded Catalog Files (Admin View)</h2>

      <div className="overflow-x-auto">
        <div className="max-h-[600px] overflow-y-auto border border-gray-300 rounded">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-indigo-600 text-white sticky top-0 z-10">
              <tr>
                <th className="py-2 px-4 text-left">File Name</th>
                <th className="py-2 px-4 text-left">File Type</th>
                <th className="py-2 px-4 text-left">Size (KB)</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">
                    No catalogs uploaded yet!
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file._id} className="border-b">
                    <td className="py-2 px-4 max-w-xs truncate" title={file.fileName}>
                      {file.fileName}
                    </td>
                    <td className="py-2 px-4">{file.fileType || 'N/A'}</td>
                    <td className="py-2 px-4">{(file.fileSize / 1024).toFixed(2)}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => handleDownload(file._id, file.fileName)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(file._id)}
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

export default AdminCatalogue;
