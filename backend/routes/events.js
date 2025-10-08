const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// get events for a month range (YYYY-MM)
router.get('/', async (req, res) => {
  // accept ?month=2025-09
  const { month } = req.query;
  try {
    // naive: find dates that start with month (YYYY-MM)
    const events = await Event.find({ date: new RegExp('^' + month) }).sort('date');
    res.json(events);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// get single day events
router.get('/day/:date', async (req, res) => {
  const date = req.params.date; // YYYY-MM-DD
  const events = await Event.find({ date }).sort('startTime');
  res.json(events);
});

// create event
router.post('/', async (req, res) => {
  const ev = new Event(req.body);
  await ev.save();
  res.status(201).json(ev);
});

module.exports = router;
