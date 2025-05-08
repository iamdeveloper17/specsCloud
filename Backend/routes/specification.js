const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../controllers/specificationController');
const specification = require('../models/Specification'); // ✅ important

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Correct Route for Upload
router.post('/upload', upload.array('files'), uploadFile);

// Other Routes (no change needed)
router.get('/files', async (req, res) => {
  const { userId } = req.query;
  try {
    const files = userId 
      ? await specification.find({ uploadedById: userId }, 'fileName fileType fileSize category folderName')
      : await specification.find({}, 'fileName fileType fileSize category folderName');
    res.status(200).json(files);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Fetching files failed' });
  }
});

router.get('/download/:id', async (req, res) => {
  try {
    const file = await specification.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    res.setHeader('Content-Type', file.fileType);
    res.setHeader('Content-Disposition', `inline; filename="${file.fileName}"`);
    res.send(file.fileData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Download failed' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await specification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Delete failed' });
  }
});

router.put('/rename/:id', async (req, res) => {
  const { newName } = req.body;
  if (!newName || newName.trim() === '') {
    return res.status(400).send('Invalid file name');
  }
  try {
    const file = await specification.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    file.fileName = newName;
    await file.save();

    res.send('File renamed successfully');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Rename failed');
  }
});

// Fetch all unique folders with file counts
// 📂 Get list of folders + file names inside each folder
// 📂 GET folders - Specification files
router.get('/folders', async (req, res) => {
  try {
    const specificationFiles = await specification.find({}, 'fileName fileType fileSize folderName category');

    const grouped = {};

    specificationFiles.forEach(file => {
      const folder = file.folderName || 'No Folder';
      if (!grouped[folder]) {
        grouped[folder] = [];
      }
      grouped[folder].push({
        _id: file._id,
        fileName: file.fileName,
        fileType: file.fileType,
        category: file.category,
        type: 'Specification', // ✅ important
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



// Rename a folder
router.put('/folders/:folderName', async (req, res) => {
  const { newFolderName } = req.body;
  const { folderName } = req.params;
  if (!newFolderName || newFolderName.trim() === '') {
    return res.status(400).send('Invalid new folder name');
  }
  try {
    await specification.updateMany({ folderName }, { folderName: newFolderName });
    res.send('Folder renamed successfully');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Rename folder failed');
  }
});

// Delete a folder
router.delete('/folders/:folderName', async (req, res) => {
  const { folderName } = req.params;
  try {
    await specification.deleteMany({ folderName });
    res.send('Folder deleted successfully');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Delete folder failed');
  }
});


module.exports = router;
