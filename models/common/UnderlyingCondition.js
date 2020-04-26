const mongoose = require('mongoose');
const { Schema } = mongoose;

const UnderlyingConditionsSchema = new Schema({
  chronicLungDisease: { type: Boolean },
  heartDisease: { type: Boolean },
  liverDisease: { type: Boolean },
  renalDisease: { type: Boolean },
  autoimmuneDisease: { type: Boolean },
  cancer: { type: Boolean },
  diabetes: { type: Boolean },
  hiv: { type: Boolean },
  pregnancy: { type: Boolean },
});

module.exports = UnderlyingConditionsSchema;
