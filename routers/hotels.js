const express = require('express');
const router = express.Router();
const catchAysnc = require('../utils/catchAsync');
const Hotel = require('../models/hotel');
const { isLoggedIn, isAuthor, validateHotel } = require('../middleware');
const hotels = require('../controllers/hotels');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAysnc(hotels.index))
    .post(isLoggedIn, upload.array('image'), validateHotel, catchAysnc(hotels.createHotel));

router.get('/new', isLoggedIn, hotels.renderNewForm);

router.route('/:id')
    .get(catchAysnc(hotels.showHotel))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateHotel, catchAysnc(hotels.updateHotel))
    .delete(isLoggedIn, isAuthor, catchAysnc(hotels.deleteHotel));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAysnc(hotels.renderEditForm));

module.exports = router;