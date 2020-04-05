'use strict';

const { getModel, handleError, handleResponse, initializeMongoDb } = require('../helpers');
const { omit } = require('lodash');
const MongoQS = require('mongo-querystring');

// is it a re-used lambda instance? If so, connection is already established
var dbConnectPromise = typeof dbConnectPromise === 'undefined' ? null : dbConnectPromise
const initPromise = initializeMongoDb({dbConnectPromise})

// Create a new Mongo QueryString parser
const qs = new MongoQS({
  custom: {
    bbox: 'geojson',
    near: 'geojson', // For future use.
  },
});

module.exports.list = async (event, context, callback) => {
  // ensure async connection to DB is completed
  await initPromise
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
    console.error(error.message);
    handleError(callback, 'general', error);
  }
};
