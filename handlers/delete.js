'use strict';
const { getModel, handleError, handleResponse, initializeMongoDb } = require('../helpers');

// is it a re-used lambda instance? If so, connection is already established
var dbConnectPromise = typeof dbConnectPromise === 'undefined' ? null : dbConnectPromise
const initPromise = initializeMongoDb({dbConnectPromise})


module.exports.delete = async (event, context, callback) => {
  // ensure async connection to DB is completed
  await initPromise

  const {
    pathParameters: { type, id },
  } = event;

  const Model = getModel(type);

  if (!Model) {
    return handleError(callback, 'noModelFound');
  }

  try {
    // Temporarily removed until scopes are defined.
    await Model.deleteOne({ _id: id });

    handleResponse(callback, true, 200);
  } catch (error) {
    console.error(error.message);
    handleError(callback, 'general', error);
  }
};
