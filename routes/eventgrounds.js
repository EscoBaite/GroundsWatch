const express = require('express')
const router = express.Router()
const eventgrounds = require('../controllers/eventgrounds')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })

const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateEventground } = require('../middleware')

router.route('/')
    .get(catchAsync(eventgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateEventground, catchAsync(eventgrounds.createEventground))

router.get('/new', isLoggedIn, eventgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(eventgrounds.showEventground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateEventground, catchAsync(eventgrounds.updateEventground))
    .delete(isLoggedIn, isAuthor, catchAsync(eventgrounds.destroyEventground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(eventgrounds.renderEditForm))

module.exports = router