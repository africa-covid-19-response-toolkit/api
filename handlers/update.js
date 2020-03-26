'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const { getTable, prepUpdateParams } = require('../helpers');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const {
    pathParameters: { type, id },
  } = event;

  const table = getTable(type);

  if (!table)
    callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: `Unknown type provided. Type name: ${type}`,
    });

  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const params = {
    TableName: table,
    Key: {
      id,
    },
    ...prepUpdateParams({ ...data, updatedAt: timestamp }),
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: "Couldn't fetch the todo item.",
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
