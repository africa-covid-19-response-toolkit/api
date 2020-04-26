const mongoose = require('mongoose');
const { Schema } = mongoose;
const personFields = require('./common/Person');

const CommunitySchema = new Schema(
  {
    ...personFields,
    source: { type: String },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model('Community', CommunitySchema);
