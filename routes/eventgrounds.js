const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Eventground = require('../models/eventground')
const { eventgroundSchema } = require('../schemas.js')
const { isLoggedIn } = require('../middleware')

const validateEventground = (req, res, next) => {
    const { error } = eventgroundSchema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            next();
        }
}

router.get('/', catchAsync(async (req, res) => {
    const eventgrounds = await Eventground.find({})
    res.render('eventgrounds/index', { eventgrounds })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('eventgrounds/new')
})

router.post('/', isLoggedIn, validateEventground, catchAsync(async (req, res) => {
    const eventground = new Eventground(req.body.eventground)
    await eventground.save()
    req.flash('success', 'Successfully made a new eventground!')
    res.redirect(`/eventgrounds/${eventground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const eventground = await Eventground.findById(req.params.id).populate('reviews')
    if (!eventground) {
        req.flash('error', 'Cannot find that eventground!');
        return res.redirect('/eventgrounds');
    }
    res.render('eventgrounds/details', {eventground})
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const eventground = await Eventground.findById(req.params.id)
    if (!eventground) {
        req.flash('error', 'Cannot find that eventground!');
        return res.redirect('/eventgrounds');
    }
    res.render('eventgrounds/edit', {eventground})
}))

router.put('/:id', isLoggedIn, validateEventground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const eventground = await Eventground.findByIdAndUpdate(id, { ...req.body.eventground });
    req.flash('success', 'Successfully updated the eventground!')
    res.redirect(`/eventgrounds/${eventground._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Eventground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted eventground')
    res.redirect('/eventgrounds');
}))

module.exports = router