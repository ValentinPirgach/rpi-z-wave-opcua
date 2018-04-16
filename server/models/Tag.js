import mongoose from 'mongoose'

const Schema = mongoose.Schema

// create a schema
const tagSchema = new Schema({
  nodeId: { type: String, required: true, unique: true },
  watch: { type: Boolean, default: false },
})

// the schema is useless so far
// we need to create a model using it
const Tag = mongoose.model('Tag', tagSchema)

// make this available to our users in our Node applications
export default Tag
