const Specification = require('../models/Specification');

const uploadFile = async (req, res) => {
  try {
    const category = req.body.category || 'N/A'; // ✅ Get category from body
    const folderName = req.body.folderName || 'General'; // ✅ Get folderName from body, fallback if missing

    const files = req.files; // req.files is an array

    const uploadedFiles = [];

    for (const file of files) {
      const newFile = new Specification({
        fileName: file.filename,
        fileType: file.mimetype,
        fileSize: file.size,
        fileData: file.buffer,
        uploadedById: req.body.userId,
        uploadedByEmail: req.body.userEmail,
        category: category, // ✅ Save category for each file
        folderName: folderName, // ✅ Important: save folder name also
      });

      const savedFile = await newFile.save();
      uploadedFiles.push(savedFile);
    }

    res.status(201).json({ message: 'Files uploaded successfully', files: uploadedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
};

module.exports = { uploadFile };
