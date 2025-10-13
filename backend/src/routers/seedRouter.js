
const express = require("express");
const seedEvents = require("../controllers/seedController");

const seedRouter = express.Router();

seedRouter.post("/events", seedEvents);

module.exports = seedRouter;