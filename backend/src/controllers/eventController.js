const Event = require('../models/eventModel');

// Get all events, optionally filtered by month
const getAllEvents = async (req, res) => {
  const { month } = req.query;
  try {
    const events = month 
      ? await Event.find({ date: new RegExp('^' + month) }).sort('date') 
      : await Event.find().sort('date');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get events for a specific day
const getEventsByDay = async (req, res) => {
  const date = req.params.date;
  try {
    const events = await Event.find({ date }).sort('startTime');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  try {
    const ev = new Event(req.body);
    await ev.save();
    res.status(201).json(ev);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {getAllEvents, getEventsByDay, createEvent };
