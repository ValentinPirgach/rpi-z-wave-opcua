import mongoose from 'mongoose'

const Schema = mongoose.Schema

// create a schema
const deviceSchema = new Schema({
  browseName: { type: String, required: true },
  nodeId: { type: String, required: true, unique: true },
  componentsCount: { type: Number },
})

// the schema is useless so far
// we need to create a model using it
const Device = mongoose.model('Device', deviceSchema)

// make this available to our users in our Node applications
export default Device
