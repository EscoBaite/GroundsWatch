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
    for (let i = 0; i < 300; i++){
        const rand1000 = Math.floor(Math.random()* 1000)
        const price = Math.floor(Math.random()* 20) + 10
        const capacity = Math.floor(Math.random()* 5000)+ 100
        const eventG = new Eventground({
            author: '641324ce31514603107adb80',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            capacity,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude
                ]
            },
            images: [
                {
                    url: "https://res.cloudinary.com/dpne2hq8r/image/upload/v1679171836/GroundsWatch/bhmdzb9advaatfmqmz65.jpg",  
                    filename: "GroundsWatch/bhmdzb9advaatfmqmz65"
                },
                {
                    url: "https://res.cloudinary.com/dpne2hq8r/image/upload/v1679171685/GroundsWatch/dio9nz3ghbjlcn2lfftc.jpg",
                    filename: "GroundsWatch/dio9nz3ghbjlcn2lfftc"
                }
            ]
        })
        await eventG.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})