const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PassengerSchema = new Schema(
  {
    firstName: { type: String, required: true, max: 100 },
    middleName: { type: String, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    gender: { type: String },
    dateOfBirth: { type: Date },
    nationality: { type: String },
    passportNo: { type: String },
    travelFrom: { type: String },
    phoneNumber: { type: String },
    hotelName: { type: String },
    flightNumber: { type: String },
    seatNumber: { type: String },
    transitFrom: { type: String },
    fever: { type: Boolean },
    shortnessOfBreath: { type: Boolean },
    cough: { type: Boolean },
    dependents: [
      {
        firstName: { type: String, max: 100 },
        middleName: { type: String, max: 100 },
        lastName: { type: String, max: 100 },
        gender: { type: String },
        dateOfBirth: { type: Date },
        nationality: { type: String },
        passportNo: { type: String },
        seatNumber: { type: String },
        fever: { type: Boolean },
        shortnessOfBreath: { type: Boolean },
        cough: { type: Boolean },
        travelFrom: { type: String },
        transitFrom: { type: String },
        phoneNumber: { type: String },
        flightNumber: { type: String },
        selectedLanguage: { type: String },
      },
    ],
    otherHotelName: { type: String },
    email: {
      type: String,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    language: { type: String },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model('Passenger', PassengerSchema);
