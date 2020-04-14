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

module.exports.update = async (event, context, callback) => {
  const {
    pathParameters: { type, id },
  } = event;

  const Model = getModel(type);

  if (!Model) {
    return handleError(callback, 'noModelFound');
  }

  let data = JSON.parse(event.body);
  let db = null;
  try {
    db = await mongoose.connect(mongoUrl, options);

    // Useful for partial object update.
    // Converts : {"someObject": { "someKey": "someValue"}} to {"someObject.someKey": "someValue"}
    data = flatten(data);

    const result = await Model.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });

    // Close connection
    db.connection.close();

    handleResponse(callback, result);
  } catch (error) {
    // Close connection.
    if (db && db.connection) db.connection.close();
    handleError(callback, '', error);
  }
};
