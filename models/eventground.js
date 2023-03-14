const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    capacity: Number,
    description: String,
    location: String,
})

module.exports = mongoose.model('Eventground', EventgroundSchema)