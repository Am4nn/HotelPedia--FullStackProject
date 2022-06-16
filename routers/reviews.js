const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const Hotel = require('../models/hotel');
const catchAysnc = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');
const review = require('../models/review');

router.post('/', isLoggedIn, validateReview, catchAysnc(reviews.createReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAysnc(reviews.deleteReview));

module.exports = router;