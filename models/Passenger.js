const mongoose = require('mongoose');
const { Schema } = mongoose;

const passengerFields = require('./common/Passenger');
const PassengerDependent = require('./common/PassengerDependent');

const PassengerSchema = new Schema(
  {
    ...passengerFields,
    dependents: [
      {
        type: PassengerDependent,
      },
    ],
    source: { type: String },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model('Passenger', PassengerSchema);
