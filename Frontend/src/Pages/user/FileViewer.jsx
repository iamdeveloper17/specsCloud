import React from 'react';
import { useLocation } from 'react-router-dom';

const FileViewer = () => {
  const { state } = useLocation();
  const file = state?.file;

  if (!file) {
    return <div className="p-6 text-red-600">File not found in route state.</div>;
  }

//   const fileUrl = `https://specscloud-1.onrender.com/api/catalogue/download/${file._id}`;
const fileUrl = `https://specscloud-1.onrender.com/uploads/${file.fileName}`;

  const fileType = file.fileType;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Viewing File: {file.fileName}</h2>

      {fileType.startsWith('image/') && <img src={fileUrl} alt="File" className="w-full h-auto" />}
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
          <p className="text-gray-600">Preview not available for this file type. Please download it to view.</p>
        )}
    </div>
  );
};

export default FileViewer;
