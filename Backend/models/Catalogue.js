const mongoose = require('mongoose');

const catalogueSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileData: { type: Buffer, required: false }, // 💥 save file binary
}, { timestamps: true });

module.exports = mongoose.model('Catalogue', catalogueSchema);
