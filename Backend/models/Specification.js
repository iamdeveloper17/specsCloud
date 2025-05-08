const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  fileName: String,
  fileType: String,
  fileSize: Number,
  fileData: Buffer,
  folderName: String, // ✅
  uploadedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedByEmail: String,
  category: { type: String, default: 'N/A' }, // ✅ Add this line
});

module.exports = mongoose.model('Specification', specificationSchema);
