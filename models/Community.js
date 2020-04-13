const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = require('./common/address');
const SymptomSchema = require('./common/symptom');
const UnderlyingConditionsSchema = require('./common/underlyingConditions');

const CommunitySchema = new Schema(
  {
    firstName: { type: String, required: true, max: 100 },
    middleName: { type: String, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    language: { type: String },
    address: { type: AddressSchema },
    symptom: { type: SymptomSchema },
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
    underlyingConditions: {
      type: UnderlyingConditionsSchema
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model('Community', CommunitySchema);
