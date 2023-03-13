const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Eventground = require('./models/eventground')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

mongoose.connect('mongodb://127.0.0.1:27017/groundswatch', { useCreateIndex: true, useUnifiedTopology: true,  useNewUrlParser: true })
    .then(() => {
        console.log("Database CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    })

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/eventgrounds', async (req, res) => {
    const eventgrounds = await Eventground.find({})
    res.render('eventgrounds/index.ejs', { eventgrounds })
})



app.listen(3000, () => {
    console.log('Listening on port 3000')
})
