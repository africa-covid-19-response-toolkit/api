const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressModel = require('./Address');
const SymptomModel = require('./Symptom');

const MedicalFacilitySchema = new Schema(
  {
    firstName: { type: String, required: true, max: 100 },
    middleName: { type: String, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    nationality: { type: String },
    email: {
      type: String,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    address: { type: AddressModel.schema },
    symptom: { type: SymptomModel.schema },
    phoneNumber: { type: String },
    occupation: { type: String },
    callDate: { type: Date },
    callerType: { type: String },
    travelHx: { type: Boolean },
    contactWithSuspected: { type: Boolean },
    contactWithConfirmed: { type: Boolean },
    healthFacility: { type: Boolean },
    receiverName: { type: String },
    source: { type: String },
    formStatus: { type: String },
    underlyingConditions: {
      chronicLungDisease: { type: Boolean },
      heartDisease: { type: Boolean },
      liverDisease: { type: Boolean },
      renalDisease: { type: Boolean },
      autoimmuneDisease: { type: Boolean },
      cancer: { type: Boolean },
      diabetes: { type: Boolean },
      hiv: { type: Boolean },
      pregnancy: { type: Boolean },
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model('MedicalFacility', MedicalFacilitySchema);
