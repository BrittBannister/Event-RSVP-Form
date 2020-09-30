import express from 'express'
import bodyParser from 'body-parser'
const pug = require('pug')
import mongoose from 'mongoose'
import './model/guest'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'pug')
app.set('views', 'views')
// app.use(express.static('./public'))
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

mongoose.connect('mongodb://localhost:27017/rsvp', {
  useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useFindAndModify: false,
  //   useCreateIndex: true,
})

//used fom kitten tutorial
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('connected!')
})

const Guest = mongoose.model('Guest')

app.get('/', async (req, res) => {
  res.render('index', { title: 'Event RSVP' })
})

app.post('/reply', async (req, res) => {
  const newGuest = new Guest({
    name: req.body.name,
    email: req.body.email,
    attending: req.body.attending == 'true' ? true : false,
    guests: req.body.guests,
  })
  newGuest.save()
  res.render('reply')
})

app.get('/guests', (req, res) => {
  Guest.find((err, data) => {
    console.log(data)
    let attendingData = data.map((guest) => {
      if (guest.attending === true) {
        return guest.name
      }
    })
    let notAttendingData = data.map((guest) => {
      if (guest.attending === false) {
        return guest.name
      }
    })
    res.render('guests', {
      title: 'Guests',
      h1: 'Guest List',
      attending: attendingData,
      notAttending: notAttendingData,
    })
  })
})

app.get('*', (req, res) => {
  res.status(404).send('404 Not Found')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server started on port ${port}...`))

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at: ', promise, 'reason:', reason)
})
