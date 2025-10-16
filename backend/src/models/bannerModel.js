// backend/src/models/bannerModel.js
const { Schema, model } = require('mongoose');

const BannerSchema = new Schema({
  filename: String,
  originalName: String,
  size: Number,
  mimeType: String,
  dateFor: { type: String },
  viewType: { type: String },
  event: { type: Schema.Types.ObjectId, ref: 'Event' }  // <--- new
}, { timestamps: true });

module.exports = model('Banner', BannerSchema);
