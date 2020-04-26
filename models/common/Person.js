const BiographicalData = require('./BiographicalData');
const RiskFromContact = require('./RiskFromContact');
const UnderlyingCondition = require('./UnderlyingCondition');
const Symptom = require('./Symptom');

const PersonFields = {
  biographicalData: { type: BiographicalData },
  riskFromContact: { type: RiskFromContact },
  underlyingConditions: { type: UnderlyingCondition },
  symptoms: { type: Symptom },
  latitude: { type: Number },
  longitude: { type: Number },
};

module.exports = PersonFields;
