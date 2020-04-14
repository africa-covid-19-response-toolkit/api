const mongoose = require('mongoose');
const {Schema} = mongoose;

const AddressSchema = new Schema({
  country: { type: String, required: true, max: 100 },
  region: { type: String, max: 100 },
  city: { type: String, max: 100 },
  postalCode: { type: String, max: 100 },
  street: { type: String, max: 100 },
  building: { type: String, max: 100 },
  customField1: { type: String, max: 100 },
  customField2: { type: String, max: 100 },
});

// Export the model
module.exports = AddressSchema;
