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
    callback(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: `Unknown type provided. Type name: ${type}`,
      }),
    });
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

    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result),
    });
  } catch (error) {
    // Close connection
    if (db && db.connection) db.connection.close();
    console.error(error.message);
    callback(null, {
      statusCode: error.statusCode || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: `Problem updating ${type} data with id ${id}. ${error.message}`,
      }),
    });
  }
};
