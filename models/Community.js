const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommunitySchema = new Schema(
  {
    firstName: { type: String, required: true, max: 100 },
    middleName: { type: String, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    language: { type: String },
    region: { type: String },
    subcityOrZone: { type: String },
    sefer: { type: String },
    woreda: { type: String },
    kebele: { type: String },
    houseNo: { type: String },
    phoneNo: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    fever: { type: Boolean },
    cough: { type: Boolean },
    shortnessOfBreath: { type: Boolean },
    formStatus: { type: String },
    travelHx: { type: Boolean },
    haveSex: { type: Boolean },
    animalMarket: { type: Boolean },
    healthFacility: { type: Boolean },
    occupation: { type: String },
    dataSource: { type: String },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model('Community', CommunitySchema);
