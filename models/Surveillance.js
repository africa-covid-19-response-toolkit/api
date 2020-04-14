const mongoose = require('mongoose');
const {Schema} = mongoose;

const EmailSchema = require('./common/email');
const baseFields = require('./common/base');

const SurveillanceSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model('Surveillance', SurveillanceSchema);
