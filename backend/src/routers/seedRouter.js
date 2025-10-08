// backend/src/routes/seedRouter.js
const express = require('express');
const seedRouter = express.Router();
const { seedEvents } = require('../controllers/seedController');

// Route to seed events
seedRouter.post('/events', seedEvents);

module.exports = seedRouter;
