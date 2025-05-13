import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FileViewer = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const file = state?.file;

  if (!file) {
    return <div className="p-6 text-red-600">File not found in route state.</div>;
  }

  const fileUrl = `https://specscloud-1.onrender.com/uploads/${file.fileName}`;
  const fileType = file.fileType;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Viewing File: {file.fileName}</h2>
        <button
          onClick={() => navigate(-1)} // ⬅️ Go back one page
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          ← Back
        </button>
      </div>

      {fileType.startsWith('image/') && (
        <img src={fileUrl} alt="File" className="w-full h-auto" />
      )}

      {fileType === 'application/pdf' && (
        <iframe src={fileUrl} title="PDF Viewer" className="w-full h-[90vh]" />
      )}

      {(fileType.includes('msword') || fileType.includes('openxmlformats')) && (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
          title="Office Viewer"
          className="w-full h-[90vh]"
        />
      )}

      {!fileType.startsWith('image/') &&
        fileType !== 'application/pdf' &&
        !fileType.includes('msword') &&
        !fileType.includes('openxmlformats') && (
          <p className="text-gray-600 mt-4">
            Preview not available for this file type. Please download it to view.
          </p>
        )}
    </div>
  );
};

export default FileViewer;
