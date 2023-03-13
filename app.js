const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const Eventground = require('./models/eventground')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


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
    res.render('eventgrounds/index', { eventgrounds })
})

app.get('/eventgrounds/new', (req, res) => {
    res.render('eventgrounds/new');
})

app.post('/eventgrounds', async (req, res) => {
    const eventground = new Eventground(req.body.eventground);
    await eventground.save();
    res.redirect(`/eventgrounds/${eventground._id}`)
})

app.get('/eventgrounds/:id', async (req, res) => {
    const eventground = await Eventground.findById(req.params.id)
    res.render('eventgrounds/details', {eventground})
})

app.get('/eventgrounds/:id/edit', async (req, res) => {
    const eventground = await Eventground.findById(req.params.id)
    res.render('eventgrounds/edit', {eventground})
})

app.put('/eventgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const eventground = await Eventground.findByIdAndUpdate(id, { ...req.body.eventground });
    res.redirect(`/eventgrounds/${eventground._id}`)
});

app.delete('/eventgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Eventground.findByIdAndDelete(id);
    res.redirect('/eventgrounds');
})


app.listen(3000, () => {
    console.log('Listening on port 3000')
})
