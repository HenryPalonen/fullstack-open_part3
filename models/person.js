const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Data model
const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]+$/.test(v); // Allow letters and spaces
      },
      message: props => `${props.value} is not a valid name, use only letters`
    },
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(\d{3}\s?\d{7})$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number, use 040 1234567 or 0407437433!`
    },
  }
  //number: String
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', phonebookSchema)