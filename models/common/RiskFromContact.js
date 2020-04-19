const mongoose = require('mongoose');
const { Schema } = mongoose;

const RiskFromContactSchema = new Schema({
  hasRecentlyTraveled: { type: Boolean },
  contactWithSuspected: { type: Boolean },
  contactWithConfirmed: { type: Boolean },
  worksAtOrVisitedHealthFacility: { type: Boolean },
});

module.exports = RiskFromContactSchema;
