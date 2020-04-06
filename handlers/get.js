'use strict';

const mongoose = require('mongoose');
const { getModel, handleError, handleResponse } = require('../helpers');

const mongoUrl = process.env.DOCUMENT_DB_URL;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
mongoose.Promise = global.Promise;

module.exports.get = async (event, context, callback) => {
  const {
    pathParameters: { type, id },
  } = event;

  const Model = getModel(type);

  if (!Model) {
    return handleError(callback, 'noModelFound');
  }
  let db = null;
  try {
    db = await mongoose.connect(mongoUrl, options);

    // Result
    const result = await Model.findOne({ _id: id });

    // Close connection
    db.connection.close();

    handleResponse(callback, result);
  } catch (error) {
    // Close connection.
    if (db && db.connection) db.connection.close();
    handleError(callback, '', error);
  }
};
