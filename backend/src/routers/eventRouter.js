const express = require("express");
const { getEventsByMonth } = require("../controllers/eventController");
const eventRouter = express.Router();

// GET /api/events?year=YYYY&month=MM
eventRouter.get("/", getEventsByMonth);

module.exports = eventRouter;
