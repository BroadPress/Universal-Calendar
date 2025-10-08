const express = require('express');
const eventRouter = express.Router();
const eventController = require('../controllers/eventController');

// Routes
eventRouter.get('/', eventController.getAllEvents);
eventRouter.get('/day/:date', eventController.getEventsByDay);
eventRouter.post('/', eventController.createEvent);

module.exports = eventRouter;
