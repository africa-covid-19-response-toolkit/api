'use strict';

const mongoose = require('mongoose');
const { getModel, handleError, handleResponse } = require('../helpers');

const mongoUrl = process.env.DOCUMENT_DB_URL;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
mongoose.Promise = global.Promise;

let db = null

module.exports.create = async (event, context, callback) => {
  const {
    pathParameters: { type },
  } = event;

  const Model = getModel(type);

  if (!Model) {
    return handleError(callback, 'noModelFound');
  }

  const data = JSON.parse(event.body);

  try {
    if (!db || db.connection.readyState !== 1) {
      db = await mongoose.connect(mongoUrl, options);
    }

    const result = await Model.create(data);

    handleResponse(callback, result, 201);
  } catch (error) {
    handleError(callback, '', error);
  }
};
