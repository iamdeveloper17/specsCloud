const mongoose = require('mongoose');

const catalogueSchema = new mongoose.Schema({
  fileName: String,
  fileType: String,
  fileSize: Number,
  folderName: String, // ✅
  uploadedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedByEmail: String,
  category: { type: String, default: 'N/A' }, // ✅ Add this line
});

module.exports = mongoose.model('Catalogue', catalogueSchema);
