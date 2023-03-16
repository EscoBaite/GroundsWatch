const express = require('express');
const router = express.Router({ mergeParams: true })

const Eventground = require('../models/eventground')
const Review = require('../models/review')

const { reviewSchema } = require('../schemas.js')

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const eventground = await Eventground.findById(req.params.id);
    const review = new Review(req.body.review);
    eventground.reviews.push(review);
    await review.save();
    await eventground.save();
    req.flash('success', 'Created new review')
    res.redirect(`/eventgrounds/${eventground._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Eventground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted the review')
    res.redirect(`/eventgrounds/${id}`);
}))

module.exports = router
