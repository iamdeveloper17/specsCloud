const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../controllers/catalogueController');
const Catalogue = require('../models/Catalogue');
const Specification = require('../models/Specification'); // ✅ Important

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Route
router.post('/upload', upload.array('files'), uploadFile);

// Get Files Route
router.get('/files', async (req, res) => {
  const { userId } = req.query;
  try {
    const files = userId 
      ? await Catalogue.find({ uploadedById: userId }, 'fileName fileType fileSize category folderName')
      : await Catalogue.find({}, 'fileName fileType fileSize category folderName');
    res.status(200).json(files);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Fetching files failed' });
  }
});

// Download File
router.get('/download/:id', async (req, res) => {
  try {
    const file = await Catalogue.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    res.setHeader('Content-Type', file.fileType);
    res.setHeader('Content-Disposition', `inline; filename="${file.fileName}"`);
    res.send(file.fileData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Download failed' });
  }
});

// Delete File
router.delete('/delete/:id', async (req, res) => {
  try {
    await Catalogue.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Delete failed' });
  }
});

// Rename File
router.put('/rename/:id', async (req, res) => {
  const { newName } = req.body;
  if (!newName || newName.trim() === '') {
    return res.status(400).send('Invalid file name');
  }
  try {
    const file = await Catalogue.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    file.fileName = newName;
    await file.save();

    res.send('File renamed successfully');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Rename failed');
  }
});

// Final 🛠 Merge Folders Route
router.get('/folders', async (req, res) => {
  try {
    const catalogueFiles = await Catalogue.find({}, 'fileName fileType fileSize folderName category');
    const specificationFiles = await Specification.find({}, 'fileName fileType fileSize folderName category');

    const allFiles = [
      ...catalogueFiles.map(f => ({ ...f.toObject(), source: 'Catalogue' })),
      ...specificationFiles.map(f => ({ ...f.toObject(), source: 'Specification' })),
    ];

    const grouped = {};

    allFiles.forEach(file => {
      const folder = file.folderName || 'No Folder';
      if (!grouped[folder]) {
        grouped[folder] = [];
      }
      grouped[folder].push(file);
    });

    const folders = Object.keys(grouped).map(folderName => ({
      _id: folderName,
      fileCount: grouped[folderName].length,
      files: grouped[folderName],
    }));

    res.status(200).json(folders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Fetching folders failed' });
  }
});

module.exports = router;
