const Event = require("../models/eventModel");

// Fetch events for a specific month and year
const getEventsByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required" });
    }

    console.log("Fetching events for:", year, month);

    // Find events matching the month and year
    const events = await Event.find({
      "date.year": Number(year),
      "date.month": month
    }).lean();

    console.log("Events found:", events.length);
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch events", error });
  }
};

module.exports = { getEventsByMonth };
