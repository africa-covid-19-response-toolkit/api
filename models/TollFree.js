const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TollFreeSchema = new Schema(
  {
    firstName: { type: String, required: true, max: 100 },
    middleName: { type: String, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    age: { type: Number },
    sex: { type: String },
    reportRegion: {
      id: { type: Number },
      name: { type: String },
    },
    region: {
      id: { type: Number },
      name: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      description: { type: String },
      createdAt: { type: Date },
      updatedAt: { type: Date },
      deletedAt: { type: Date },
    },
    zone: {
      id: { type: Number },
      name: { type: String },
    },
    woreda: {
      id: { type: Number },
      name: { type: String },
    },
    city: {
      id: { type: Number },
      name: { type: String },
    },
    subcity: {
      id: { type: Number },
      name: { type: String },
    },
    kebele: {
      id: { type: Number },
      name: { type: String },
    },
    createdBy: {
      id: { type: Number },
      firstName: { type: String },
      middleName: { type: String },
      lastName: { type: String },
      email: {
        type: String,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
      },
      phoneNumber: { type: String },
      region: {
        id: { type: Number },
        firstName: { type: String },
        middleName: { type: String },
        lastName: { type: String },
        email: {
          type: String,
          lowercase: true,
          match: [/\S+@\S+\.\S+/, 'is invalid'],
          index: true,
        },
        phoneNumber: { type: String },
      },
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
