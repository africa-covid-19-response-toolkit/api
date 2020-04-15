'use strict';

const mongoose = require('mongoose');
const flatten = require('flat');

const { getModel, handleError, handleResponse } = require('../helpers');

const mongoUrl = process.env.DOCUMENT_DB_URL;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
mongoose.Promise = global.Promise;
let db = null

module.exports.update = async (event, context, callback) => {
  const {
    pathParameters: { type, id },
  } = event;

  const Model = getModel(type);

  if (!Model) {
    return handleError(callback, 'noModelFound');
  }

  let data = JSON.parse(event.body);

  try {
    if (!db || db.connection.readyState !== 1) {
      db = await mongoose.connect(mongoUrl, options);
    }

    // Useful for partial object update.
    // Converts : {"someObject": { "someKey": "someValue"}} to {"someObject.someKey": "someValue"}
    data = flatten(data);

    const result = await Model.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });

    handleResponse(callback, result);
  } catch (error) {
    
    handleError(callback, '', error);
  }
};
