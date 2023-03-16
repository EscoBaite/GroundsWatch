const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Eventground = require('../models/eventground')
const { isLoggedIn, isAuthor, validateEventground } = require('../middleware')


router.get('/', catchAsync(async (req, res) => {
    const eventgrounds = await Eventground.find({})
    res.render('eventgrounds/index', { eventgrounds })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('eventgrounds/new')
})

router.post('/', isLoggedIn, validateEventground, catchAsync(async (req, res) => {
    const eventground = new Eventground(req.body.eventground)
    eventground.author = req.user._id
    await eventground.save()
    req.flash('success', 'Successfully made a new eventground!')
    res.redirect(`/eventgrounds/${eventground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const eventground = await Eventground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    console.log(eventground)
    if (!eventground) {
        req.flash('error', 'Cannot find that eventground!')
        return res.redirect('/eventgrounds')
    }
    res.render('eventgrounds/details', {eventground})
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params
    const eventground = await Eventground.findById(id)
    if (!eventground) {
        req.flash('error', 'Cannot find that eventground');
        return res.redirect('/eventgrounds')
    }
    res.render('eventgrounds/edit', {eventground})
}))

router.put('/:id', isLoggedIn, isAuthor, validateEventground, catchAsync(async (req, res) => {
    const { id } = req.params
    const eventground = await Eventground.findByIdAndUpdate(id, { ...req.body.eventground })
    req.flash('success', 'Successfully updated the eventground!')
    res.redirect(`/eventgrounds/${eventground._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    await Eventground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted eventground')
    res.redirect('/eventgrounds')
}))

module.exports = router