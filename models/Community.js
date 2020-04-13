const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressModel = require('./Address');
const SymptomModel = require('./Symptom');
const UnderlyingConditionsSchema = require('./common/UnderlyingConditions');

const CommunitySchema = new Schema(
  {
    firstName: { type: String, required: true, max: 100 },
    middleName: { type: String, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    language: { type: String },
    address: { type: AddressModel.schema },
    symptom: { type: SymptomModel.schema },
    phoneNumber: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    formStatus: { type: String },
    travelHx: { type: Boolean },
    contactWithSuspected: { type: Boolean },
    contactWithConfirmed: { type: Boolean },
    healthFacility: { type: Boolean },
    occupation: { type: String },
    dataSource: { type: String },
    underlyingConditions: UnderlyingConditions,
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model('Community', CommunitySchema);
