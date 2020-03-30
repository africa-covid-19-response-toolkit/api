'use strict';

const { v4 } = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const { removeEmptyStringElements, getTable } = require('../helpers');
const { isEmpty } = require('lodash');
const schema = require('../schema');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = async (event, context, callback) => {
  const {
    pathParameters: { type },
  } = event;

  const table = getTable(type);

  if (!table) {
    callback(null, {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Unknown type provided. Type name: ${type}`,
      }),
    });
    return;
  }

  const timestamp = new Date().getTime();

  let data = JSON.parse(event.body);

  try {
    // Remove empty strings because DynamoDB ValidationException.
    data = removeEmptyStringElements(data);

    try {
      // Validate data.
      if (!isEmpty(schema[type])) data = await schema[type].validateAsync(data);
    } catch (error) {
      callback(null, {
        statusCode: error.statusCode || 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: ` ${type} validation error occurred. ${error.message}. Please refer https://github.com/Ethiopia-COVID19/api-gateway#data-structure.`,
        }),
      });
      return;
    }

    const params = {
      TableName: table,
      Item: {
        ...data,
        id: v4(),
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };

    // write the {type} to the database
    await dynamoDb.put(params).promise();

    const response = {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params.Item),
    };

    callback(null, response);
  } catch (error) {}
};
