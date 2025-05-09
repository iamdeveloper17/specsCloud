const Catalogue = require('../models/Catalogue');

const uploadFile = async (req, res) => {
  try {
    const category = req.body.category || 'N/A';
    const folderName = req.body.folderName || 'General';
    const userId = req.body.userId;
    const userEmail = req.body.userEmail;

    const files = req.files;
    const uploadedFiles = [];

    for (const file of files) {
      const newFile = new Catalogue({
        fileName: file.filename,       // ⚠️ Use multer-generated disk filename
        fileType: file.mimetype,
        fileSize: file.size,
        uploadedById: userId,
        uploadedByEmail: userEmail,
        category: category,
        folderName: folderName
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
