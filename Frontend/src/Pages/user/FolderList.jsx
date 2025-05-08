import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

const FolderList = () => {
    const [folders, setFolders] = useState([]);
    const [editingFolder, setEditingFolder] = useState(null);
    const [newFolderName, setNewFolderName] = useState('');
    const [expandedFolders, setExpandedFolders] = useState([]);

    // 🛠 Fetch BOTH catalogue and specification folders
    const fetchFolders = async () => {
        try {
            const [catalogueRes, specificationRes] = await Promise.all([
                axios.get('https://specscloud-1.onrender.com/api/catalogue/folders'),
                axios.get('https://specscloud-1.onrender.com/api/specification/folders')
            ]);

            const mergedFolders = {};

            // 📂 Merge catalogue files
            catalogueRes.data.forEach(folder => {
                if (!mergedFolders[folder._id]) {
                    mergedFolders[folder._id] = { ...folder, files: [] };
                }
                mergedFolders[folder._id].files.push(...folder.files.map(file => ({ ...file, source: 'catalogue' })));
            });

            // 📂 Merge specification files
            specificationRes.data.forEach(folder => {
                if (!mergedFolders[folder._id]) {
                    mergedFolders[folder._id] = { _id: folder._id, fileCount: 0, files: [] };
                }
                mergedFolders[folder._id].files.push(...folder.files.map(file => ({ ...file, source: 'specification' })));
            });

            // 🧹 Clean fileCount
            const finalFolders = Object.values(mergedFolders).map(folder => ({
                ...folder,
                fileCount: folder.files.length,
            }));

            setFolders(finalFolders);
        } catch (error) {
            console.error(error.message);
            toast.error('Failed to fetch folders');
        }
    };

    useEffect(() => {
        fetchFolders();
    }, []);

    const toggleExpand = (folderId) => {
        if (expandedFolders.includes(folderId)) {
            setExpandedFolders(expandedFolders.filter(id => id !== folderId));
        } else {
            setExpandedFolders([...expandedFolders, folderId]);
        }
    };

    const handleViewFile = async (file) => {
        const baseApi = file.source === 'specification' ? 'specification' : 'catalogue';
        try {
            const res = await axios.get(`https://specscloud-1.onrender.com/api/${baseApi}/download/${file._id}`, {
                responseType: 'blob',
            });
            const fileType = res.headers['content-type'];
            const blob = new Blob([res.data], { type: fileType });
            const url = window.URL.createObjectURL(blob);

            if (fileType.includes('msword') || fileType.includes('officedocument') || fileType.includes('presentation') || fileType.includes('spreadsheet')) {
                const encodedUrl = encodeURIComponent(url);
                window.open(`https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`, '_blank');
            } else if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
                window.open(url, '_blank');
            } else {
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file.fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                toast.info('File downloaded (preview not available)');
            }
        } catch (error) {
            console.error(error.message);
            toast.error('Failed to view file');
        }
    };

    const handleDownloadFile = async (file) => {
        const baseApi = file.source === 'specification' ? 'specification' : 'catalogue';
        try {
            const res = await axios.get(`https://specscloud-1.onrender.com/api/${baseApi}/download/${file._id}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Download started');
        } catch (error) {
            console.error(error.message);
            toast.error('Download failed');
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">Folders Management</h2>
            <div className="overflow-x-auto">
                <div className="max-h-[600px] overflow-y-auto rounded-lg border border-gray-300">
                    <table className="min-w-full text-sm">
                        <thead className="bg-indigo-600 text-white sticky top-0 z-10">
                            <tr>
                                <th className="py-2 px-4 text-left">Folder Name</th>
                                <th className="py-2 px-4 text-left">Number of Files</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {folders.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="py-6 text-center text-gray-500">No folders found!</td>
                                </tr>
                            ) : (
                                folders.map((folder) => (
                                    <React.Fragment key={folder._id}>
                                        <tr className="border-b">
                                            <td className="py-2 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => toggleExpand(folder._id)} className="focus:outline-none">
                                                        {expandedFolders.includes(folder._id) ? <FaChevronDown className="text-indigo-600" /> : <FaChevronRight className="text-indigo-600" />}
                                                    </button>
                                                    <span>{folder._id || 'No Name'}</span>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4">{folder.fileCount}</td>
                                            <td className="py-2 px-4"></td>
                                        </tr>

                                        {expandedFolders.includes(folder._id) && (
                                            <tr>
                                                <td colSpan="3" className="bg-gray-50">
                                                    <div className="p-4 space-y-3">
                                                        {folder.files.length > 0 ? (
                                                            folder.files.map((file) => (
                                                                <div key={file._id} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded px-4 py-2 shadow-sm">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium text-gray-700">{file.fileName}</span>
                                                                        <div className="text-xs text-gray-500">
                                                                            Type: <span className="font-semibold">{file.source || 'Catalogue'}</span> | Category: <span className="font-semibold">{file.category || 'N/A'}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                                                                        <button onClick={() => handleViewFile(file)} className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600">View</button>
                                                                        <button onClick={() => handleDownloadFile(file)} className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600">Download</button>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-gray-500">No files inside this folder.</p>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FolderList;
