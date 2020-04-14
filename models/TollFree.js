const mongoose = require('mongoose');
const {Schema} = mongoose;

const AddressSchema = require('./common/address');
const EmailSchema = require('./common/email');
const baseFields = require('./common/base');


const TollFreeSchema = new Schema(
  {
    ...baseFields,
    reportingFrom: { type: AddressSchema },
    createdBy: {
      firstName: { type: String, required: true, max: 100 },
      middleName: { type: String, max: 100 },
      lastName: { type: String, required: true, max: 100 },
      email: EmailSchema,
      phoneNumber: { type: String },
      address: { type: AddressSchema },
      role: {
        id: { type: Number },
        name: { type: String },
      },
      callCenter: {
        id: { type: Number },
        name: { type: String },
      },
      active: { type: Boolean },
      emailVerifiedAt: { type: Boolean },
      createdAt: { type: Date },
      updatedAt: { type: Date },
      deletedAt: { type: Date },
    },
    secondPhoneNumber: { type: String },
    occupation: { type: String },
    callerType: { type: String },
    other: { type: String },
    reportType: { type: String },
    reportGroup: {
      id: { type: Number },
      name: { type: String },
    },
    description: { type: String },
    remark1: { type: String },
    remark2: { type: String },
    travelHx: { type: Boolean },
    haveSex: { type: Boolean },
    visitedAnimal: { type: Boolean },
    visitedHf: { type: Boolean },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    deletedAt: { type: Date },
    rumorTypes: [],
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model('TollFree', TollFreeSchema);
