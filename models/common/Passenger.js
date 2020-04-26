const personFields = require('./Person');

const PassengerFields = {
  ...personFields,
  travelFromCountry: { type: String, required: true, max: 100 },
  finalTransitCountry: { type: String, required: true, max: 100 },
  flightNumber: { type: String, required: true, max: 100 },
  seatNumber: { type: String, required: true, max: 100 },
  stayingAtHotel: { type: String, required: true, max: 100 },
};

module.exports = PassengerFields;
