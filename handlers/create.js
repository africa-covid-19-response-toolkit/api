'use strict';

const mongoose = require('mongoose');
const { getModel } = require('../helpers');

const mongoUrl = process.env.DOCUMENT_DB_URL;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
mongoose.Promise = global.Promise;

module.exports.create = async (event, context, callback) => {
  const {
    pathParameters: { type },
  } = event;

  const Model = getModel(type);

  if (!Model) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Unknown type provided. Type name: ${type}`,
      }),
    };
  }
  let db = null;
  const data = JSON.parse(event.body);

  try {
    db = await mongoose.connect(mongoUrl, options);

    const result = await Model.create(data);

    // Close connection
    db.connection.close();

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(result),
    };
  } catch (error) {
    // Close connection
    if (db && db.connection) db.connection.close();
    console.error(error.message);
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Problem creating ${type} data. ${error.message}`,
      }),
    };
  }
};
