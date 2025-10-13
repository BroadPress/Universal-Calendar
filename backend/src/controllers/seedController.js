const Event = require("../models/eventModel");
const demoEvents = require("../seeds/eventsData");


const seedEvents = async (req, res) => {
  try {
    await Event.deleteMany({});
    await Event.insertMany(demoEvents);
    res.status(200).json({ message: "✅ Events seeded successfully!" });
  } catch (error) {
    console.error("❌ Error seeding events:", error);
    res.status(500).json({ message: "Error seeding events", error });
  }
};

module.exports = seedEvents;