'use strict';

const mongoose = require('mongoose');
const { getModel, handleError, handleResponse } = require('../helpers');
const { omit } = require('lodash');
const MongoQS = require('mongo-querystring');

const mongoUrl = process.env.DOCUMENT_DB_URL;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
mongoose.Promise = global.Promise;

// Create a new Mongo QueryString parser
const qs = new MongoQS({
  custom: {
    bbox: 'geojson',
    near: 'geojson', // For future use.
  },
});


let db = null;
module.exports.list = async (event, context, callback) => {
  const {
    pathParameters: { type },
    queryStringParameters,
  } = event;

  // Parse the request query parameters
  const query = queryStringParameters
    ? qs.parse(omit(queryStringParameters, ['_start', '_limit'])) // exclude _start and _limit.
    : {};

  const Model = getModel(type);

  if (!Model) {
    return handleError(callback, 'noModelFound');
  }

  try {
    if (!db || db.connection.readyState !== 1) {
      db = await mongoose.connect(mongoUrl, options);
    }

    const start =
      queryStringParameters && queryStringParameters._start
        ? parseInt(queryStringParameters._start) || null
        : null;
    const limit =
      queryStringParameters && queryStringParameters._limit
        ? parseInt(queryStringParameters._limit) || null
        : null;

    // Count
    const count = await Model.countDocuments(query).skip(start).limit(limit);

    // Result
    const result = await Model.find(query).skip(start).limit(limit);

    handleResponse(callback, { count, result });
  } catch (error) {
    handleError(callback, '', error);
  }
};
