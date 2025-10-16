const express = require('express');
const bannerRouter = express.Router();
const upload = require('../config/multer');
const bannerController = require('../controllers/bannerController');

// Upload banners
bannerRouter.post('/', upload.array('file'), bannerController.createBanner);

// Get banners for a specific event
bannerRouter.get('/event/:eventId', bannerController.getBannersByEvent);

// Optional: get banners by day
bannerRouter.get('/day/:date', bannerController.getBannersByDay);

// Get all banners
bannerRouter.get('/', bannerController.getAllBanners);

// Delete a banner
bannerRouter.delete('/:id', bannerController.deleteBanner);

module.exports = bannerRouter;
