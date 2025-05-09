const Catalogue = require('../models/Catalogue');

const uploadFile = async (req, res) => {
  try {
    const category = req.body.category || 'N/A';
    const folderName = req.body.folderName || 'General';
    const userId = req.body.userId;
    const userEmail = req.body.userEmail;

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const newFile = new Catalogue({
        fileName: file.filename,  // ✅ diskStorage uses this
        fileType: file.mimetype,
        fileSize: file.size,
        uploadedById: userId,
        uploadedByEmail: userEmail,
        category,
        folderName,
      });

      const savedFile = await newFile.save();
      uploadedFiles.push(savedFile);
    }

    res.status(201).json({ message: 'Files uploaded successfully', files: uploadedFiles });

  } catch (error) {
    console.error('Upload error:', error); // ✅ shows crash reason
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
};

module.exports = { uploadFile };
