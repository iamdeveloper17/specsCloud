import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Catalogue = () => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/catalogue/files');
      setFiles(res.data);
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to fetch files');
    }
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

    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append('files', file);
    }

    try {
      await axios.post('http://localhost:8080/api/catalogue/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
      toast.success('Files uploaded successfully!');
      fetchFiles(); // Refresh the table
      setSelectedFiles([]);
      setUploadProgress(0);
    } catch (error) {
      console.error(error.message);
      toast.error('Upload failed');
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/catalogue/download/${id}`, {
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
      await axios.delete(`http://localhost:8080/api/catalogue/delete/${id}`);
      toast.success('File deleted successfully');
      fetchFiles(); // Refresh the table
    } catch (error) {
      console.error(error.message);
      toast.error('Delete failed');
    }
  };

  const handleRename = async (file) => {
    const newName = window.prompt('Enter new file name:', file.fileName);
    if (!newName || newName.trim() === '' || newName === file.fileName) {
      return; // Cancel if no change
    }
  
    try {
      await axios.put(`http://localhost:8080/api/catalogue/rename/${file._id}`, { newName });
      toast.success('File renamed successfully');
      fetchFiles(); // Refresh file list
    } catch (error) {
      console.error(error.message);
      toast.error('Rename failed');
    }
  };
  

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Upload Catalog Files</h2>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="block w-full border border-gray-300 rounded px-4 py-2 mb-4 text-sm"
      />

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
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-indigo-600 text-white">
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
  onClick={() => handleRename(file)}
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
    </div>
  );
};

export default Catalogue;
