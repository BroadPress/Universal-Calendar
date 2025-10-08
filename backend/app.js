require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

connectDB();
const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use('/api/events', require('./routes/events'));
app.use('/api/banners', require('./routes/banners'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server listening on', PORT));
