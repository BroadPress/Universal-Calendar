const path = require('path');
const fs = require('fs');
const Banner = require('../models/bannerModel');

// Create/upload banners and associate with an event
const createBanner = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'No files uploaded' });

    const { dateFor, viewType, eventId } = req.body;

    const banners = req.files.map(f => ({
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
      mimeType: f.mimetype,
      dateFor: dateFor || null,
      viewType: viewType || 'event',
      event: eventId || null   // Associate banner with event
    }));

    const savedBanners = await Banner.insertMany(banners);

    const data = savedBanners.map(b => ({
      ...b.toObject(),
      url: `${req.protocol}://${req.get('host')}/uploads/${b.filename}`
    }));

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get banners for a specific event
const getBannersByEvent = async (req, res) => {
  try {
    const banners = await Banner.find({ event: req.params.eventId }).sort('-createdAt');
    const data = banners.map(b => ({
      ...b.toObject(),
      url: `${req.protocol}://${req.get('host')}/uploads/${b.filename}`
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Optional: get banners by day (if needed)
const getBannersByDay = async (req, res) => {
  try {
    const date = req.params.date;
    const banners = await Banner.find({ dateFor: date }).sort('-createdAt');
    const data = banners.map(b => ({
      ...b.toObject(),
      url: `${req.protocol}://${req.get('host')}/uploads/${b.filename}`
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all banners
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort('-createdAt');
    const data = banners.map(b => ({
      ...b.toObject(),
      url: `${req.protocol}://${req.get('host')}/uploads/${b.filename}`
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete banner
const deleteBanner = async (req, res) => {
  try {
    const id = req.params.id;
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    // Delete file from server
    const filePath = path.join(__dirname, '..', 'public', 'uploads', banner.filename);
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete file:', err);
    });

    res.json({ message: 'Banner deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBanner, getBannersByEvent, getBannersByDay, getAllBanners, deleteBanner };
