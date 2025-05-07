import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminCatalogue = () => {
  const [files, setFiles] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewFileUrl, setViewFileUrl] = useState('');
  const [viewFileType, setViewFileType] = useState('');

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

  const handleView = async (id, fileType) => {
    try {
      const res = await axios.get(`https://specscloud-1.onrender.com/api/catalogue/download/${id}`, {
        responseType: 'blob',
      });

      let blob;
      if (fileType === 'application/pdf') {
        blob = new Blob([res.data], { type: 'application/pdf' }); // 🧡 Force type
      } else if (fileType.startsWith('image/')) {
        blob = new Blob([res.data], { type: fileType });
      } else {
        blob = new Blob([res.data]);
      }

      const url = window.URL.createObjectURL(blob);
      setViewFileUrl(url);
      setViewFileType(fileType);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to load file for viewing');
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
                        onClick={() => handleView(file._id, file.fileType)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        View
                      </button>
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

      {/* View Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">View File</h2>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  window.URL.revokeObjectURL(viewFileUrl); // 🧹 Clean memory
                  setViewFileUrl('');
                  setViewFileType('');
                }}
                className="text-red-500 text-xl font-bold hover:text-red-700"
              >
                ×
              </button>
            </div>

            {/* Display content based on file type */}
            {/* Display content based on file type */}
            {viewFileType.startsWith('image/') && (
              <img src={viewFileUrl} alt="file" className="w-full h-auto" />
            )}

            {viewFileType === 'application/pdf' && (
              <iframe
                src={viewFileUrl}
                title="PDF Viewer"
                type="application/pdf"
                className="w-full h-[80vh]"
              />
            )}

            {(viewFileType.includes('word') || viewFileType.includes('presentation') || viewFileType.includes('excel')) && (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewFileUrl)}`}
                title="Office File Viewer"
                className="w-full h-[80vh]"
              />
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCatalogue;