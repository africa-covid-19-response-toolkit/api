const mongoose = require('mongoose');
const { Schema } = mongoose;

const personFields = require('./Person');

const PassengerDependentSchema = new Schema({
  ...personFields,
  seatNumber: { type: String, required: true, max: 100 },
  relationshipToPassenger: { type: String, required: true, max: 100 },
});

module.exports = PassengerDependentSchema;
