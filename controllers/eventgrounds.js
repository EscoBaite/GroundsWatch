const Eventground = require('../models/eventground')

module.exports.index = async (req, res) => {
    const eventgrounds = await Eventground.find({})
    res.render('eventgrounds/index', { eventgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('eventgrounds/new')
}

module.exports.createEventground = async (req, res) => {
    const eventground = new Eventground(req.body.eventground)
    eventground.author = req.user._id
    await eventground.save()
    req.flash('success', 'Successfully made a new eventground!')
    res.redirect(`/eventgrounds/${eventground._id}`)
}
module.exports.showEventground = async (req, res) => {
    const eventground = await Eventground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!eventground) {
        req.flash('error', 'Cannot find that eventground!')
        return res.redirect('/eventgrounds')
    }
    res.render('eventgrounds/details', {eventground})
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params
    const eventground = await Eventground.findById(id)
    if (!eventground) {
        req.flash('error', 'Cannot find that eventground');
        return res.redirect('/eventgrounds')
    }
    res.render('eventgrounds/edit', {eventground})
}

module.exports.updateEventground = async (req, res) => {
    const { id } = req.params
    const eventground = await Eventground.findByIdAndUpdate(id, { ...req.body.eventground })
    req.flash('success', 'Successfully updated the eventground!')
    res.redirect(`/eventgrounds/${eventground._id}`)
}

module.exports.destroyEventground = async (req, res) => {
    const { id } = req.params
    await Eventground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted eventground')
    res.redirect('/eventgrounds')
}