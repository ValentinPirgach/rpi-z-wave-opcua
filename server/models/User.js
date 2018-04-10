import mongoose from 'mongoose'

const Schema = mongoose.Schema

// create a schema
const userSchema = new Schema({
  id: Number,
  role: Number,
  login: { type: String, required: true, unique: true },
  name: String,
  lang: String,
  dashboard: [String],
  interval: Number,
  rooms: [Number],
  expert_view: Boolean,
  hide_all_device_events: Number,
  email: '',
  sid: String,
})

// the schema is useless so far
// we need to create a model using it
const User = mongoose.model('User', userSchema)

// make this available to our users in our Node applications
export default User
