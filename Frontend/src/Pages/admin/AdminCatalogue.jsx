import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const categoryOptions = ['Rehab', 'Critical Care', 'Medical Education', 'Simulation', 'Anatomy', 'Medication'];

const formatFileType = (type = '') => {
  if (type.includes('word')) return 'Word Document';
  if (type.includes('presentation')) return 'PowerPoint';
  if (type.includes('spreadsheet')) return 'Excel Sheet';
  if (type.includes('pdf')) return 'PDF';
  if (type.includes('image')) return 'Image';
  return type;
};

const AdminCatalogue = () => {
  const [files, setFiles] = useState([]);
  const [viewCategory, setViewCategory] = useState('All');
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

  const handleView = (file) => {
    const fileUrl = `https://specscloud-1.onrender.com/uploads/${file.fileName}`;
    setViewFileUrl(fileUrl);
    setViewFileType(file.fileType);
    setIsViewModalOpen(true);
  };

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const filteredFiles = viewCategory === 'All' ? files : files.filter(file => file.category === viewCategory);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">All Uploaded Catalog Files (Admin View)</h2>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setViewCategory('All')}
          className={`px-4 py-2 rounded-full border ${viewCategory === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
        >
          All
        </button>
        {categoryOptions.map((cat) => (
          <button
            key={cat}
            onClick={() => setViewCategory(cat)}
            className={`px-4 py-2 rounded-full border ${viewCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block max-h-[500px] overflow-y-auto border border-gray-300 rounded">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-indigo-600 text-white sticky top-0 z-10">
            <tr>
              <th className="py-2 px-4 text-left">S no.</th>
              <th className="py-2 px-4 text-left">File Name</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Size (KB)</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No catalogs uploaded yet!
                </td>
              </tr>
            ) : (
              filteredFiles.map((file, index) => (
                <tr key={file._id} className="border-b">
                  <td className="py-2 px-4">{index+1}</td>
                  <td className="py-2 px-4 truncate max-w-xs" title={file.fileName}>{file.fileName}</td>
                  <td className="py-2 px-4">{file.category || 'N/A'}</td>
                  <td
                    className="py-2 px-4 max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap"
                    title={file.fileType}
                  >
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
          <p className="text-center text-gray-500 py-6">No catalogs uploaded yet!</p>
        ) : (
          filteredFiles.map((file) => (
            <div key={file._id} className="border rounded p-4 shadow text-sm bg-white">
              <p><span className="font-semibold">📄 File:</span> {file.fileName}</p>
              <p><span className="font-semibold">🏷️ Category:</span> {file.category || 'N/A'}</p>
              <p><span className="font-semibold">📌 Type:</span> {formatFileType(file.fileType)}</p>
              <p><span className="font-semibold">📦 Size:</span> {(file.fileSize / 1024).toFixed(2)} KB</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button onClick={() => handleView(file)} className="bg-blue-500 text-white px-3 py-1 rounded text-xs">View</button>
                <button onClick={() => handleDownload(file._id, file.fileName)} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">Download</button>
                <button onClick={() => handleDelete(file._id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">View File</h2>
              <button onClick={() => {
                setIsViewModalOpen(false);
                window.URL.revokeObjectURL(viewFileUrl);
                setViewFileUrl('');
                setViewFileType('');
              }} className="text-red-500 text-xl font-bold hover:text-red-700">×</button>
            </div>

            {viewFileType.startsWith('image/') && (
              <img src={viewFileUrl} alt="file" className="w-full h-auto" />
            )}
            {viewFileType === 'application/pdf' && (
              <iframe src={viewFileUrl} title="PDF Viewer" type="application/pdf" className="w-full h-[80vh]" />
            )}
            {(viewFileType.includes('word') || viewFileType.includes('presentation') || viewFileType.includes('excel')) && (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewFileUrl)}`}
                title="Office File Viewer"
                className="w-full h-[80vh]"
              />
            )}
            {!viewFileType.startsWith('image/') && viewFileType !== 'application/pdf' && !viewFileType.includes('word') && !viewFileType.includes('presentation') && !viewFileType.includes('excel') && (
              <p className="text-center text-gray-500">Preview not available. Please download the file to view it.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCatalogue;
