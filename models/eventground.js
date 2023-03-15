const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    capacity: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

module.exports = mongoose.model('Eventground', EventgroundSchema)