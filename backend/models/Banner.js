const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  size: Number,
  mimeType: String,
  dateFor: { type: String }, // YYYY-MM-DD
  viewType: { type: String } // 'stories', 'instagram', 'roadblock', ...
}, { timestamps: true });

module.exports = mongoose.model('Banner', BannerSchema);
