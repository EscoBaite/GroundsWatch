const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
})

module.exports = mongoose.model('Eventground', EventgroundSchema)