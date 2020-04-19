const mongoose = require('mongoose');
const { Schema } = mongoose;

const personFields = require('./common/Person');

const MedicalFacilitySchema = new Schema(
  {
    ...personFields,
    callDate: { type: Date },
    callerType: { type: String },
    source: { type: String },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model('MedicalFacility', MedicalFacilitySchema);
