// backend/src/routers/banners.js
const express = require('express');
const bannerRouter = express.Router();
const upload = require('../config/multer'); // multer instance
const bannerController = require('../controllers/bannerController'); 

// upload a banner (multipart/form-data)
bannerRouter.post('/', upload.array('file'), bannerController.createBanner);
// get banners for a date
bannerRouter.get('/day/:date', bannerController.getBannersByDay);

// get all
bannerRouter.get('/', bannerController.getAllBanners);

// delete a banner
bannerRouter.delete('/:id', bannerController.deleteBanner);

module.exports = bannerRouter;
