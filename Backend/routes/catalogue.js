const express = require('express');
const router = express.Router();
const multer = require('multer');
const Catalogue = require('../models/Catalogue'); // Correct model

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload files
router.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const { userId } = req.body; // 🧠 get userId from body (frontend must send it during upload)

    const filesData = req.files.map(file => ({
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      fileData: file.buffer,
      uploadedBy: userId, // 📦 Save uploadedBy field
    }));

    await Catalogue.insertMany(filesData);

    res.status(201).json({ message: 'Files uploaded and saved!' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Fetch file list (filtered by user)
router.get('/files', async (req, res) => {
  const { userId } = req.query;

  try {
    let files;
    if (userId) {
      files = await Catalogue.find({ uploadedBy: userId }, 'fileName fileType fileSize'); // 🔥 Only user's files
    } else {
      files = await Catalogue.find({}, 'fileName fileType fileSize'); // fallback
    }
    res.status(200).json(files);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Fetching files failed' });
  }
});

// Download a specific file
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

// Delete a file
router.delete('/delete/:id', async (req, res) => {
  try {
    await Catalogue.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Delete failed' });
  }
});

// Rename a file
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

module.exports = router;
