const mongoose = require('mongoose');
const { Schema } = mongoose;

const Address = require('./Address');

const ContactInformationSchema = new Schema({
  address: { type: Address },
  email: {
    type: String,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  phoneNumber: { type: String, required: true, max: 100 },
});

// Export the model
module.exports = ContactInformationSchema;
