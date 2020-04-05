'use strict';

const mongoose = require('mongoose');
const { getModel, handleError, handleResponse } = require('../helpers');

const mongoUrl = process.env.DOCUMENT_DB_URL;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
mongoose.Promise = global.Promise;

module.exports.create = async (event, context, callback) => {
  const type = 'communities';

  const Model = getModel(type);

  if (!Model) {
    return handleError(callback, 'noModelFound');
  }
  let db = null;
  const data = JSON.parse(event.body);

  try {
    db = await mongoose.connect(mongoUrl, options);

    const result = await Model.create(data);

    // Close connection
    db.connection.close();

    handleResponse(callback, result, 201);
  } catch (error) {
    console.error(error.message);
    // Close connection.
    if (db && db.connection) db.connection.close();
    handleError(callback, 'general', error);
  }
};
