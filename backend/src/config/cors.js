require("dotenv").config();
const cors = require("cors");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // React dev server port

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from React dev server or no origin (Postman)
    if (!origin || origin === FRONTEND_URL) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

module.exports = cors(corsOptions);
