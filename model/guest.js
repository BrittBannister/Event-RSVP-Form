import mongoose from 'mongoose'
const Schema = mongoose.Schema

const GuestSchema = new Schema({
  name: String,
  email: String,
  attending: Boolean,
  guests: Number,
})

const Guest = mongoose.model('Guest', GuestSchema)
module.exports = Guest
