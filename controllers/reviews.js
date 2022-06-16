const Review = require('../models/review');
const Hotel = require('../models/hotel');

module.exports.createReview = async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    const review = new Review(req.body.review);
    hotel.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await hotel.save();
    req.flash('success', 'Successfully created a new review!');
    res.redirect(`/hotels/${hotel._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Hotel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/hotels/${id}`);
}