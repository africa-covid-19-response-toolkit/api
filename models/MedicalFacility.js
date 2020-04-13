const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = require('./common/address');
const SymptomSchema = require('./common/symptom');
const UnderlyingConditionsSchema = require('./common/underlyingConditions');
const EmailSchema = require('./common/email');

const MedicalFacilitySchema = new Schema(
  {
    firstName: { type: String, required: true, max: 100 },
    middleName: { type: String, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    nationality: { type: String },
    email: EmailSchema,
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    address: { type: AddressSchema },
    symptom: { type: SymptomSchema },
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
      type: UnderlyingConditionsSchema
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model('MedicalFacility', MedicalFacilitySchema);
