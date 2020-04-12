const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SymptomSchema = new Schema({
  fever: { type: Boolean },
  cough: { type: Boolean },
  shortnessOfBreath: { type: Boolean },
  fatigue: { type: Boolean },
  headache: { type: Boolean },
  runnyNose: { type: Boolean },
  feelingUnwell: { type: Boolean },
});

// Export the model
module.exports = mongoose.model('Symptom', SymptomSchema);
