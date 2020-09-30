// import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
const pug = require('pug')

mongoose.connect('mongodb://localhost:27017/rsvp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

//used fom kitten tutorial
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('connected!')
})

const responseSchema = mongoose.Schema({
  name: String,
  email: String,
  attending: Boolean,
  guests: Number,
})

const Response = mongoose.model('responses', responseSchema)

const app = express()
app.set('view engine', 'pug')
app.use(express.static('./public'))
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render('index', { title: 'Event RSVP' })
})

app.post('/reply', (req, res) => {
  console.log(req.body)
  const data = new Response({
    name: req.body.name,
    email: req.body.email,
    attending: req.body.attending,
    guests: req.body.guests,
  })
  data.save()
  res.render('reply')
})

app.get('/guests', (req, res) => {
  Response.find((err, data) => {
    let attendingData = data.map((group) => {
      if (group.attending === true) {
        return group
      }
    })
    let notAttendingData = data.map((group) => {
      if (group.attending === false) {
        return group
      }
    })

    if (err) {
      return
    } else {
      res.render('guests', {
        title: 'Guests',
        h1: 'Guest List',
        attending: attendingData,
        notAttending: notAttendingData,
      })
    }
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
