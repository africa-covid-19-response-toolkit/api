'use strict';

const { getModel, handleError, handleResponse, initializeMongoDb } = require('../helpers');

// is it a re-used lambda instance? If so, connection is already established
var dbConnectPromise = typeof dbConnectPromise === 'undefined' ? null : dbConnectPromise
const initPromise = initializeMongoDb({dbConnectPromise})


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

    const result = await Model.create(data);

    handleResponse(callback, result, 201);
  } catch (error) {
    console.error(error.message);
    handleError(callback, 'general', error);
  }
};
