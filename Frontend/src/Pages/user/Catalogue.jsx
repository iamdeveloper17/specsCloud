import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Catalogue = () => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameFileId, setRenameFileId] = useState(null);
  const [renameFileName, setRenameFileName] = useState('');

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewFileUrl, setViewFileUrl] = useState('');
  const [viewFileType, setViewFileType] = useState('');

  const fetchFiles = async () => {
    const userId = localStorage.getItem('userId');
    const res = await axios.get(`https://specscloud-1.onrender.com/api/catalogue/files?userId=${userId}`);
    setFiles(res.data);
  };
  
  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.warn('Please select files first!');
      return;
    }
  
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail'); // 👈 Save and get userEmail during login too
  
    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append('files', file);
    }
    formData.append('userId', userId);
    formData.append('userEmail', userEmail); // 👈 send userEmail too
  
    try {
      await axios.post('https://specscloud-1.onrender.com/api/catalogue/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
  
      toast.success('Files uploaded successfully!');
      fetchFiles();
      setSelectedFiles([]);
      setUploadProgress(0);
    } catch (error) {
      console.error(error.message);
      toast.error('Upload failed');
    }
  };
  

  const handleDownload = async (id, name) => {
    try {
      const res = await axios.get(`https://specscloud-1.onrender.com/catalogue/download/${id}`, {
        responseType: 'blob', // Important for downloading files
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
      fetchFiles(); // Refresh the table
    } catch (error) {
      console.error(error.message);
      toast.error('Delete failed');
    }
  };

  const openRenameModal = (file) => {
    setRenameFileId(file._id);
    setRenameFileName(file.fileName);
    setIsRenameModalOpen(true);
  };

  const handleView = async (id, fileType) => {
    try {
      const res = await axios.get(`https://specscloud-1.onrender.com/api/catalogue/download/${id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      setViewFileUrl(url);
      setViewFileType(fileType);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to load file for viewing');
    }
  };



  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Upload Catalog Files</h2>

      <div className="relative mb-4">
  <input
    type="file"
    id="fileInput"
    multiple
    onChange={handleFileChange}
    className="hidden"
  />
  <label
    htmlFor="fileInput"
    className="block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded px-4 py-2 text-center cursor-pointer hover:bg-gray-300 transition"
  >
    Choose Files
  </label>
</div>

      <button
        onClick={handleUpload}
        className="w-full bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-800 transition mb-6"
      >
        Upload Files
      </button>

      {/* Progress Bar */}
      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div
            className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <h3 className="text-lg font-semibold mb-4">
        Total Catalogs Imported: <span className="text-indigo-600">{files.length}</span>
      </h3>

      <div className="overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto border border-gray-300 rounded">
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
                    <td className="py-2 px-4 max-w-xs truncate cursor-pointer" title={file.fileName}>
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
                        onClick={() => openRenameModal(file)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Rename
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
                <button
                  onClick={() => setIsRenameModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      if (!renameFileName.trim()) {
                        toast.error('File name cannot be empty');
                        return;
                      }

                      await axios.put(`https://specscloud-1.onrender.com/api/catalogue/rename/${renameFileId}`, {
                        newName: renameFileName,
                      });

                      toast.success('File renamed successfully!');
                      setIsRenameModalOpen(false);
                      fetchFiles();
                    } catch (error) {
                      console.error(error.message);
                      toast.error('Rename failed');
                    }
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        )}

        {isViewModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">View File</h2>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    window.URL.revokeObjectURL(viewFileUrl); // Clean memory
                  }}
                  className="text-red-500 text-xl font-bold hover:text-red-700"
                >
                  ×
                </button>
              </div>

              {/* View File Here */}
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


              {viewFileType.includes('presentation') || viewFileType.includes('powerpoint') ? (
                <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${viewFileUrl}`} className="w-full h-[80vh]" title="PPT Viewer"></iframe>
              ) : null}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Catalogue;
