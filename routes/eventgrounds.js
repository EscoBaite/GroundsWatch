const express = require('express')
const router = express.Router()
const eventgrounds = require('../controllers/eventgrounds')

const catchAsync = require('../utils/catchAsync')
const Eventground = require('../models/eventground')
const { isLoggedIn, isAuthor, validateEventground } = require('../middleware')

router.route('/')
    .get(catchAsync(eventgrounds.index))
    .post(isLoggedIn, validateEventground, catchAsync(eventgrounds.createEventground))

router.get('/new', isLoggedIn, eventgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(eventgrounds.showEventground))
    .put(isLoggedIn, isAuthor, validateEventground, catchAsync(eventgrounds.updateEventground))
    .delete(isLoggedIn, isAuthor, catchAsync(eventgrounds.destroyEventground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(eventgrounds.renderEditForm))

module.exports = router