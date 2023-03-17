const Eventground = require('../models/eventground')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const eventground = await Eventground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    eventground.reviews.push(review)
    await review.save()
    await eventground.save()
    req.flash('success', 'Created new review')
    res.redirect(`/eventgrounds/${eventground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Eventground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted the review')
    res.redirect(`/eventgrounds/${id}`)
}