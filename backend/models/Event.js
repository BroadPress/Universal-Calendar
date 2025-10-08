const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true }, // ISO date (YYYY-MM-DD)
  startTime: String,
  endTime: String,
  color: { type: String, default: '#f7c6c6' },
  category: { type: String },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
