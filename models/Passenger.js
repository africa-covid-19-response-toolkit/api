const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = require('./common/address');
const SymptomSchema = require('./common/symptom');
const UnderlyingConditionsSchema = require('./common/underlyingConditions');
const EmailSchema = require('./common/email');

const PassengerSchema = new Schema(
  {
    firstName: { type: String, required: true, max: 100 },
    middleName: { type: String, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    dateOfBirth: { type: Date },
    nationality: { type: String },
    passportNo: { type: String },
    travelFrom: { type: String },
    phoneNumber: { type: String },
    hotelName: { type: String },
    flightNumber: { type: String },
    seatNumber: { type: String },
    transitFrom: { type: String },
    address: { type: AddressSchema },
    symptom: { type: SymptomSchema },
    contactWithSuspected: { type: Boolean },
    contactWithConfirmed: { type: Boolean },
    dependents: [
      {
        firstName: { type: String, required: true, max: 100 },
        middleName: { type: String, max: 100 },
        lastName: { type: String, required: true, max: 100 },
        age: { type: Number, required: true },
        sex: { type: String, required: true },
        dateOfBirth: { type: Date },
        nationality: { type: String },
        passportNo: { type: String },
        seatNumber: { type: String },
        address: { type: AddressSchema },
        symptom: { type: SymptomSchema },
        travelFrom: { type: String },
        transitFrom: { type: String },
        phoneNumber: { type: String },
        flightNumber: { type: String },
        language: { type: String },
        contactWithSuspected: { type: Boolean },
        contactWithConfirmed: { type: Boolean },
      },
    ],
    otherHotelName: { type: String },
    email: EmailSchema,
    language: { type: String },
    underlyingConditions: {
      type: UnderlyingConditionsSchema
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model('Passenger', PassengerSchema);
