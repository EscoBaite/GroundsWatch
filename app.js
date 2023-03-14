const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const { eventgroundSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const Eventground = require('./models/eventground')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)


mongoose.connect('mongodb://127.0.0.1:27017/groundswatch', { useCreateIndex: true, useUnifiedTopology: true,  useNewUrlParser: true })
    .then(() => {
        console.log("Database CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    })

const validateEventground = (req, res, next) => {
    const { error } = eventgroundSchema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            next();
        }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/eventgrounds', catchAsync(async (req, res) => {
    const eventgrounds = await Eventground.find({})
    res.render('eventgrounds/index', { eventgrounds })
}))

app.get('/eventgrounds/new', (req, res) => {
    res.render('eventgrounds/new');
})

app.post('/eventgrounds', validateEventground, catchAsync(async (req, res) => {
    const eventground = new Eventground(req.body.eventground);
    await eventground.save();
    res.redirect(`/eventgrounds/${eventground._id}`)
}))

app.get('/eventgrounds/:id', catchAsync(async (req, res) => {
    const eventground = await Eventground.findById(req.params.id)
    res.render('eventgrounds/details', {eventground})
}))

app.get('/eventgrounds/:id/edit', catchAsync(async (req, res) => {
    const eventground = await Eventground.findById(req.params.id)
    res.render('eventgrounds/edit', {eventground})
}))

app.put('/eventgrounds/:id', validateEventground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const eventground = await Eventground.findByIdAndUpdate(id, { ...req.body.eventground });
    res.redirect(`/eventgrounds/${eventground._id}`)
}))

app.delete('/eventgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Eventground.findByIdAndDelete(id);
    res.redirect('/eventgrounds');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(3000, () => {
    console.log('Listening on port 3000')
})
