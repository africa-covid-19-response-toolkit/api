'use strict';

const mongoose = require('mongoose');
const { getModel } = require('../helpers');

const mongoUrl = process.env.DOCUMENT_DB_URL;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
mongoose.Promise = global.Promise;

module.exports.list = async (event, context, callback) => {
  const {
    pathParameters: { type },
    queryStringParameters,
  } = event;

  const Model = getModel(type);

  if (!Model) {
    callback(null, {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Unknown type provided. Type name: ${type}`,
      }),
    });
    return;
  }

  try {
    const db = await mongoose.connect(mongoUrl, options);

    const start =
      queryStringParameters && queryStringParameters._start
        ? parseInt(queryStringParameters._start) || 0
        : 0;
    const limit =
      queryStringParameters && queryStringParameters._limit
        ? parseInt(queryStringParameters._limit) || 0
        : 100;

    // Count
    const count = await Model.countDocuments()
      .skip(start)
      .limit(limit);

    // Result
    const result = await Model.find()
      .skip(start)
      .limit(limit);

    // Close connection
    db.connection.close();

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ count, result }),
    };

    callback(null, response);
  } catch (error) {
    // Close connection
    db.connection.close();
    console.error(error.message);
    callback(null, {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Problem fetching ${type} data. ${error.message}`,
      }),
    });
  }
};
