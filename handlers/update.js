'use strict';

const mongoose = require('mongoose');
const { getModel } = require('../helpers');

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

  const data = JSON.parse(event.body);
  let db = null;
  try {
    db = await mongoose.connect(mongoUrl, options);

    const result = await Model.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    // Close connection
    db.connection.close();

    return {
      statusCode: 200,
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
        message: `Problem updating ${type} data with id ${id}. ${error.message}`,
      }),
    };
  }
};
