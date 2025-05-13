import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FileViewer = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const file = state?.file;

  if (!file) {
    return (
      <div className="p-6 text-red-600 text-center text-lg">
        File not found in route state.
      </div>
    );
  }

  const fileUrl = `https://specscloud-1.onrender.com/uploads/${file.fileName}`;
  const fileType = file.fileType;

  return (
    <div className="p-4 sm:p-6 max-w-screen overflow-auto">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-bold break-words">
          Viewing File: {file.fileName}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Image Preview */}
      {fileType.startsWith('image/') && (
        <img
          src={fileUrl}
          alt="File Preview"
          className="w-full max-w-full h-auto object-contain rounded shadow"
        />
      )}

      {/* PDF Preview */}
      {fileType === 'application/pdf' && (
        <iframe
          src={fileUrl}
          title="PDF Viewer"
          className="w-full min-h-[70vh] sm:min-h-[80vh] border rounded shadow"
        />
      )}

      {/* Word Doc Preview using Office Online Viewer */}
      {(fileType.includes('msword') || fileType.includes('openxmlformats')) && (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
          title="Office Viewer"
          className="w-full min-h-[70vh] sm:min-h-[80vh] border rounded shadow"
        />
      )}

      {/* Fallback for unsupported file types */}
      {!fileType.startsWith('image/') &&
        fileType !== 'application/pdf' &&
        !fileType.includes('msword') &&
        !fileType.includes('openxmlformats') && (
          <p className="text-sm sm:text-base text-gray-600 mt-4 leading-relaxed">
            Preview not available for this file type. Please download it to view.
          </p>
        )}
    </div>
  );
};

export default FileViewer;
