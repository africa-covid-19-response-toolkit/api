const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressModel = require('./Address');
const SymptomModel = require('./Symptom');
const EmailSchema = require('./common/Email');

const TollFreeSchema = new Schema(
  {
    firstName: { type: String, required: true, max: 100 },
    middleName: { type: String, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    reportingFrom: { type: AddressModel.schema },
    address: { type: AddressModel.schema },
    symptom: { type: SymptomModel.schema },
    createdBy: {
      firstName: { type: String, required: true, max: 100 },
      middleName: { type: String, max: 100 },
      lastName: { type: String, required: true, max: 100 },
      email: EmailSchema,
      phoneNumber: { type: String },
      address: { type: AddressModel.schema },
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
    phoneNumber: { type: String },
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
