// backend/src/controllers/bannerController.js
const Banner = require('../models/bannerModel');
const path = require('path');

const createBanner = async (req, res) => {
  try {
    // multer places file on req.file
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { dateFor, viewType } = req.body;
    const banner = new Banner({
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      dateFor: dateFor || null,
      viewType: viewType || 'event'
    });

    await banner.save();

    // return saved banner with publicly accessible url
    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${banner.filename}`;
    res.status(201).json({ banner, publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getBannersByDay = async (req, res) => {
  try {
    const date = req.params.date;
    const banners = await Banner.find({ dateFor: date }).sort('-createdAt');
    // add URL for each banner
    const data = banners.map(b => ({
      ...b.toObject(),
      url: `${req.protocol}://${req.get('host')}/uploads/${b.filename}`
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

const deleteBanner = async (req, res) => {
  try {
    const id = req.params.id;
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBanner, getBannersByDay, getAllBanners, deleteBanner };
