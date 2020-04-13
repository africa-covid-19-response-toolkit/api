const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressModel = require('./Address');
const SymptomModel = require('./Symptom');
const UnderlyingConditionsSchema = require('./common/UnderlyingConditions');
const EmailSchema = require('./common/Email');

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
    address: { type: AddressModel.schema },
    symptom: { type: SymptomModel.schema },
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
        address: { type: AddressModel.schema },
        symptom: { type: SymptomModel.schema },
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
    underlyingConditions: UnderlyingConditionsSchema,
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model('Passenger', PassengerSchema);
