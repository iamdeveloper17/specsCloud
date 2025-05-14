const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../controllers/catalogueController');
const Catalogue = require('../models/Catalogue');

const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post('/upload', upload.array('files'), uploadFile);

// Get Files Route
router.get('/files', async (req, res) => {
  const { userId } = req.query;
  try {
    const files = userId 
      ? await Catalogue.find({ uploadedById: userId }, 'fileName fileType fileSize category folderName _id')
      : await Catalogue.find({}, 'fileName fileType fileSize category folderName _id');
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

    const filePath = path.join(__dirname, '../uploads', file.fileName);
    res.download(filePath, file.fileName);
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
  const { userId, isAdmin } = req.query;

  try {
    const query = isAdmin === 'true' ? {} : { uploadedById: userId };
    const files = await Catalogue.find(query, 'fileName fileType fileSize folderName category uploadedById');

    const grouped = {};

    files.forEach(file => {
      const folder = file.folderName || 'No Folder';
      if (!grouped[folder]) {
        grouped[folder] = [];
      }
      grouped[folder].push({
        _id: file._id,
        fileName: file.fileName,
        fileType: file.fileType,
        category: file.category,
        type: 'Catalogue',
      });
    });

    const folders = Object.keys(grouped).map(folderName => ({
      _id: folderName,
      fileCount: grouped[folderName].length,
      files: grouped[folderName],
    }));

    res.status(200).json(folders);
  } catch (error) {
    console.error('Fetching folders failed:', error.message);
    res.status(500).json({ message: 'Fetching folders failed' });
  }
});


// In routes/catalogue.js or Catalogue.js
router.get('/file-url/:id', async (req, res) => {
  try {
    const file = await Catalogue.findById(req.params.id);
    if (!file || !file.fileName) {
      return res.status(404).json({ error: 'File not found' });
    }

    const publicUrl = `https://specscloud-1.onrender.com/uploads/${file.fileName}`;
    res.json({ url: publicUrl });
  } catch (error) {
    console.error('Error fetching file URL:', error.message);
    res.status(500).json({ error: 'Failed to generate file URL' });
  }
});

router.get('/folder-names', async (req, res) => {
  try {
    const folders = await Catalogue.distinct('folderName');
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folder names:', error.message);
    res.status(500).json({ error: 'Failed to fetch folder names' });
  }
});

module.exports = router;
