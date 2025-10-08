
require("dotenv").config();

const cors = require("cors");

const FRONTEND_URL = process.env.FRONTEND_URL; 

const corsOptions = {
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true); 

    if (origin === FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

module.exports = cors(corsOptions);
