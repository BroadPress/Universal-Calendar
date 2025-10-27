const express = require('express');
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const customCors = require("./config/cors");
const path = require('path');

// Routers
const eventRouter = require("./routers/eventRouter");
const seedRouter = require('./routers/seedRouter');
const bannerRouter = require('./routers/bannerRouter');
const authRouter = require('./routers/authRouter'); // ✅ Import auth routes

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(customCors);


// Static files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Routes
app.use("/api/events", eventRouter);     // http://localhost:5000/api/events/
app.use("/api/seed", seedRouter);        // POST http://localhost:5000/api/seed/events
app.use("/api/banners", bannerRouter);   // http://localhost:5000/api/banners/
app.use("/api/auth", authRouter);        // ✅ http://localhost:5000/api/auth/signup etc.

// Export
module.exports = app;
