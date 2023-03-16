const express = require('express')
const router = express.Router({ mergeParams: true })

const Eventground = require('../models/eventground')
const Review = require('../models/review')
const { validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')

const catchAsync = require('../utils/catchAsync')


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const eventground = await Eventground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    eventground.reviews.push(review)
    await review.save()
    await eventground.save()
    req.flash('success', 'Created new review')
    res.redirect(`/eventgrounds/${eventground._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Eventground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted the review')
    res.redirect(`/eventgrounds/${id}`)
}))

module.exports = router
