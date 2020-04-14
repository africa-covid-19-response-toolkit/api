const mongoose = require('mongoose');
const {Schema} = mongoose

const UnderlyingConditionsSchema = require('./common/underlyingConditions');
const baseSchema = require('./common/base');

const CommunitySchema = new Schema(
  {
    ...baseSchema,
    language: { type: String },
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
