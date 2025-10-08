const express = require('express');
const multer = require('multer');
const path = require('path');
const Banner = require('../models/Banner');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'public', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

// upload single or multiple banners
router.post('/upload', upload.array('banners', 8), async (req, res) => {
  const files = req.files;
  const { dateFor, viewType } = req.body;
  try {
    const saved = await Promise.all(files.map(f => {
      return new Banner({
        filename: f.filename,
        originalName: f.originalname,
        size: f.size,
        mimeType: f.mimetype,
        dateFor,
        viewType
      }).save();
    }));
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// list banners for a day
router.get('/day/:date', async (req, res) => {
  const date = req.params.date;
  const banners = await Banner.find({ dateFor: date });
  res.json(banners);
});

module.exports = router;
