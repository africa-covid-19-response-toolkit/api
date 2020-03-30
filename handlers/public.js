'use strict';

const { v4 } = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const { removeEmptyStringElements, getTable } = require('../helpers');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const table = getTable('communities');

  if (!table)
    callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Unknown type provided. Type name: communities`,
      }),
    });

  const timestamp = new Date().getTime();

  const data = JSON.parse(event.body);

  const params = {
    TableName: table,
    Item: {
      ...removeEmptyStringElements(data),
      id: v4(),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the community to the database
  dynamoDb.put(params, error => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: { message: `Couldn't create the community item.` },
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
