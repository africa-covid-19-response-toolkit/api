'use strict';

const mongoose = require('mongoose');
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

  const data = JSON.parse(event.body);
  let db = null;
  try {
    db = await mongoose.connect(mongoUrl, options);

    const result = await Model.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    // Close connection
    db.connection.close();

    handleResponse(callback, result);
  } catch (error) {
    console.error(error.message);
    // Close connection.
    if (db && db.connection) db.connection.close();
    handleError(callback, 'general', error);
  }
};
