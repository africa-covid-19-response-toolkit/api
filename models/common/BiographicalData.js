const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactInformation = require('./ContactInformation');

const BiographicalDataSchema = new Schema({
  firstName: { type: String, required: true, max: 100 },
  middleName: { type: String, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  age: { type: Number, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String, required: true },
  preferredLanguage: { type: String, max: 100 },
  occupation: { type: String, max: 100 },
  nationality: { type: String, max: 100 },
  passportNumber: { type: String, max: 100 },
  governmentIssuedId: { type: String, max: 100 },
  contactInformation: { type: ContactInformation },
});

module.exports = BiographicalDataSchema;
