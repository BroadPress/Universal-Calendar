const {Schema, model} = require('mongoose');

const EventSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  startTime: String,
  endTime: String,
  color: { type: String, default: '#f7c6c6' },
  category: { type: String },
  description: String
}, { timestamps: true });

const Event = model("Event", EventSchema);

module.exports = Event;
