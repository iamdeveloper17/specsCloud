import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Catalogue = () => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [uploadCategory, setUploadCategory] = useState('');
  const [folderName, setFolderName] = useState('');
  const [viewCategory, setViewCategory] = useState('All');

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameFileId, setRenameFileId] = useState(null);
  const [renameFileName, setRenameFileName] = useState('');

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewFileUrl, setViewFileUrl] = useState('');
  const [viewFileType, setViewFileType] = useState('');

  const categoryOptions = ['Rehab', 'Critical Care', 'Medical Education', 'Simulation', 'Anatomy', 'Medication'];
  const [folderSuggestions, setFolderSuggestions] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const folderInputRef = useRef(null);

  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (folderInputRef.current && !folderInputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {
    fetchFiles();
    fetchFolderSuggestions();
  }, []);

  const fetchFolderSuggestions = async () => {
    try {
      const res = await axios.get('https://specscloud-1.onrender.com/api/catalogue/folder-names');
      setFolderSuggestions(res.data || []);
    } catch (error) {
      console.error('Failed to fetch folder suggestions:', error.message);
    }
  };


  const fetchFiles = async () => {
    const userId = localStorage.getItem('userId');
    const res = await axios.get(`https://specscloud-1.onrender.com/api/catalogue/files?userId=${userId}`);
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const fileNames = files.map(file => file.name);
    setSelectedFileNames(fileNames);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.warn('Please select files first!');
      return;
    }
    if (!uploadCategory) {
      toast.error('Please select a category before uploading!');
      return;
    }

    if (!folderName.trim()) {  // ✅ Add this check
      toast.error('Please enter a folder name before uploading!');
      return;
    }

    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');

    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append('files', file);
    }
    formData.append('userId', userId);
    formData.append('userEmail', userEmail);
    formData.append('category', uploadCategory);
    formData.append('folderName', folderName);

    try {
      await axios.post('https://specscloud-1.onrender.com/api/catalogue/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      toast.success('Files uploaded successfully!');
      fetchFiles();
      setSelectedFiles([]);
      setSelectedFileNames([]);
      setUploadCategory('');
      setFolderName('');
      document.getElementById('fileInput').value = '';
      setUploadProgress(0);
    } catch (error) {
      console.error(error.message);
      toast.error('Upload failed');
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
      fetchFiles();
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

  // 🔥 Filtered files based on selected view category
  const filteredFiles = viewCategory === 'All' ? files : files.filter(file => file.category === viewCategory);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Upload Catalog Files</h2>

      <div ref={folderInputRef} className="relative mb-4">
        <input
          type="text"
          placeholder="Enter Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onFocus={() => setShowSuggestions(true)} // show on focus
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoComplete="off"
        />

        {showSuggestions && folderName && folderSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto">
            {folderSuggestions
              .filter(name => name.toLowerCase().includes(folderName.toLowerCase()))
              .map((name, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setFolderName(name);
                    setShowSuggestions(false); // close on click
                  }}
                  className="px-3 py-1 hover:bg-indigo-100 cursor-pointer"
                >
                  {name}
                </li>
              ))}
          </ul>
        )}
      </div>


      {/* Upload Section */}
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
        {selectedFileNames.length > 0 && (
          <div className="mt-2 text-sm text-gray-600 text-center">
            {selectedFileNames.join(', ')}
          </div>
        )}
      </div>

      {/* Upload Category Dropdown */}
      {selectedFileNames.length > 0 && (
        <select
          value={uploadCategory}
          onChange={(e) => setUploadCategory(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Category</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      )}

      {/* Upload Button */}
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

      {/* Category Filter Tabs */}
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

      {/* Files Table */}
      <div className="overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto border border-gray-300 rounded">
          <table className="min-w-full border border-gray-200 text-sm whitespace-nowrap">

            <thead className="bg-indigo-600 text-white sticky top-0 z-10 text-xs sm:text-sm">
              <tr>
                <th className="py-2 px-2 sm:px-4 text-left font-medium">Folder</th>
                <th className="py-2 px-2 sm:px-4 text-left font-medium">File</th>
                <th className="py-2 px-2 sm:px-4 text-left font-medium">Category</th>
                <th className="py-2 px-2 sm:px-4 text-left font-medium">Type</th>
                <th className="py-2 px-2 sm:px-4 text-left font-medium">Size (KB)</th>
                <th className="py-2 px-2 sm:px-4 text-left font-medium">Actions</th>
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
                filteredFiles.map((file) => (
                  <tr key={file._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2 sm:px-4">{file.folderName || 'N/A'}</td>
                    <td className="py-2 px-2 sm:px-4 truncate max-w-[150px]" title={file.fileName}>{file.fileName}</td>
                    <td className="py-2 px-2 sm:px-4">{file.category || 'N/A'}</td>
                    <td
                      className="py-2 px-2 sm:px-4 max-w-[200px] truncate text-xs sm:text-sm"
                      title={file.fileType}
                    >
                      {file.fileType || 'N/A'}
                    </td>
                    <td className="py-2 px-2 sm:px-4">{(file.fileSize / 1024).toFixed(2)}</td>
                    <td className="py-2 px-2 sm:px-4">
                      <div className="flex flex-wrap gap-1 sm:gap-2">

<button
  onClick={() => navigate('/view-file', { state: { file } })}
  className="bg-blue-500 text-white px-2 py-1 rounded"
>
  View
</button>

                        <button onClick={() => openRenameModal(file)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-yellow-600">Rename</button>
                        <button onClick={() => handleDownload(file._id, file.fileName)} className="bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-green-700">Download</button>
                        <button onClick={() => handleDelete(file._id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-red-700">Delete</button>
                      </div>
                    </td>
                  </tr>

                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rename Modal */}
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
              <button onClick={async () => {
                try {
                  if (!renameFileName.trim()) {
                    toast.error('File name cannot be empty');
                    return;
                  }
                  await axios.put(`https://specscloud-1.onrender.com/api/catalogue/rename/${renameFileId}`, { newName: renameFileName });
                  toast.success('File renamed successfully!');
                  setIsRenameModalOpen(false);
                  fetchFiles();
                } catch (error) {
                  console.error(error.message);
                  toast.error('Rename failed');
                }
              }} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Rename</button>
            </div>
          </div>
        </div>
      )}

      {/* View File Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
            {(viewFileType.includes('msword') || viewFileType.includes('openxmlformats')) && (
              <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewFileUrl)}`} title="Office File Viewer" className="w-full h-[80vh]" />
            )}
            {!viewFileType.startsWith('image/') && viewFileType !== 'application/pdf' && !viewFileType.includes('msword') && !viewFileType.includes('openxmlformats') && (
              <div className="text-center text-gray-600">
                <p>Preview not available for this file type. Please download it to view.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogue;
