import express from 'express'
import mongoose from 'mongoose'
const pug = require('pug')

const responseSchema = mongoose.Schema({
  name: String,
  email: String,
  attending: Boolean,
  guests: Number,
})

const Response = mongoose.model('responses', responseSchema)

const startServer = async () => {
  mongoose.Promise = global.Promise
  await mongoose.connect('mongodb://localhost:27017/rsvp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  const app = express()
  app.set('view engine', 'pug')
  app.use(express.static('./public'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  app.get('/', (req, res) => {
    res.render('index', { title: 'Event RSVP' })
  })

  app.get('/guestlist', (req, res) => {
    Response.find((err, data) => {
      let attendingData = data.map((groupList) => {
        if (groupList.attending === true) {
          return groupList
        }
      })
      let notAttendingData = data.map((groupList) => {
        if (groupList.attending === false) {
          return groupList
        }
      })

      if (err) {
        return console.error(err)
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

  //   //TODO: add res.status(400).send() for bad data/return
  //   //TODO: add res.status(201).send() for success
  app.post('/reply', (req, res) => {
    console.log(req.body)
    const nextResponse = new responses({
      name: req.body.name,
      email: req.body.email,
      attending: req.body.attending,
      guest: req.body.guest,
    })
    nextResponse
      .save()
      .then(() => {
        res.render('reply', {
          title: 'Thank you',
          h1: 'Thank you for your response!',
        })
      })
      .catch((err) => {
        res.status(400).send(err)
      })
  })

  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Server started on port ${port}...`))
}

try {
  startServer()
} catch (err) {
  console.error('Server unable to start.')
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at: ', promise, 'reason:', reason)
})
