const express = require('express');
const morgan = require("morgan");
const customCors = require("./config/cors");
const eventRouter = require("./routers/eventRouter");
const path = require('path');
const seedRouter = require('./routers/seedRouter');
const bannerRouter = require('./routers/bannerRouter');



const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(customCors);
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use("/api/events", eventRouter); // http://localhost:5000/api/events/
app.use("/api/seed", seedRouter);  // POST http://localhost:5000/api/seed/events
app.use('/api/banners', bannerRouter);


module.exports = app;

