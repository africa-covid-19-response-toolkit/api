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

module.exports.get = async (event, context, callback) => {
  const {
    pathParameters: { type, id },
  } = event;

  const Model = getModel(type);

  if (!Model) {
    return handleError(callback, 'noModelFound');
  }
  
  try {
    if (!db || db.connection.readyState !== 1) {
      db = await mongoose.connect(mongoUrl, options);
    }

    // Result
    const result = await Model.findOne({ _id: id });

    handleResponse(callback, result);
  } catch (error) {
    
    handleError(callback, '', error);
  }
};
