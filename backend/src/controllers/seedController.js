// backend/src/controllers/seedController.js

const Event = require("../models/eventModel");
const eventsData = require("../seeds/eventsData");


const seedEvents = async (req, res) => {
  try {
    // Delete all existing events
    await Event.deleteMany({});
    
    // Insert seed events
    const createdEvents = await Event.insertMany(eventsData);

    res.status(201).json({
      message: 'Events seeded successfully!',
      count: createdEvents.length,
      events: createdEvents
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { seedEvents };