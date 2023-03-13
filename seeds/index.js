const mongoose = require('mongoose')
const Eventground = require('../models/eventground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/groundswatch', { useCreateIndex: true, useUnifiedTopology: true,  useNewUrlParser: true })
    .then(() => {
        console.log("Database CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Eventground.deleteMany({})
    for (let i = 0; i < 50; i++){
        const rand1000 = Math.floor(Math.random()* 1000)
        const eventG = new Eventground({
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/483251',
            // description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!'
        })
        await eventG.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})