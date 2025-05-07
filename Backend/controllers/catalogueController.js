const Catalogue = require('../models/Catalogue'); // already required

const uploadFile = async (req, res) => {
  try {
    const category = req.body.category || 'N/A'; // ✅ Get category from frontend

    const newFile = new Catalogue({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileData: req.file.buffer,
      uploadedById: req.body.userId,
      uploadedByEmail: req.body.userEmail,
      category: category, // ✅ Save category into database
    });

    await newFile.save();

    res.status(201).json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'File upload failed!' });
  }
};

module.exports = { uploadFile };
