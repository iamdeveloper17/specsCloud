const mongoose = require('mongoose');

const catalogueSchema = new mongoose.Schema({
  fileName: String,
  fileType: String,
  fileSize: Number,
  fileData: Buffer,
  uploadedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  uploadedByEmail: {
    type: String,
  }
});

module.exports = mongoose.model('Catalogue', catalogueSchema);
