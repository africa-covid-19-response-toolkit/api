const mongoose = require('mongoose');
const {Schema} = mongoose

const baseFields = require('./common/base');
const UnderlyingConditionsSchema = require('./common/underlyingConditions');
const EmailSchema = require('./common/email');

const MedicalFacilitySchema = new Schema(
  {
    ...baseFields,
    nationality: { type: String },
    email: EmailSchema,
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
