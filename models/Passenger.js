const mongoose = require('mongoose');
const {Schema} = mongoose;

const UnderlyingConditionsSchema = require('./common/underlyingConditions');
const EmailSchema = require('./common/email');
const baseFields = require('./common/base');

const PassengerSchema = new Schema(
  {
    ...baseFields,
    dateOfBirth: { type: Date },
    nationality: { type: String },
    passportNo: { type: String },
    travelFrom: { type: String },
    phoneNumber: { type: String },
    hotelName: { type: String },
    flightNumber: { type: String },
    seatNumber: { type: String },
    transitFrom: { type: String },
    contactWithSuspected: { type: Boolean },
    contactWithConfirmed: { type: Boolean },
    dependents: [
      {
        ...baseFields,
        dateOfBirth: { type: Date },
        nationality: { type: String },
        passportNo: { type: String },
        seatNumber: { type: String },
        travelFrom: { type: String },
        transitFrom: { type: String },
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
