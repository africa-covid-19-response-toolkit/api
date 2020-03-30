'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const { getTable, prepUpdateParams } = require('../helpers');
const { isEmpty } = require('lodash');
const schema = require('../schema');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = async (event, context, callback) => {
  const {
    pathParameters: { type, id },
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
    try {
      // Validate data.
      if (!isEmpty(schema[type]))
        data = await schema[type].validateAsync(data, { stripUnknown: true });
    } catch (error) {
      callback(null, {
        statusCode: error.statusCode || 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `${type} validation error occurred. ${error.message}. Please refer https://github.com/Ethiopia-COVID19/api-gateway#data-structure.`,
        }),
      });
      return;
    }

    const params = {
      TableName: table,
      Key: {
        id,
      },
      ...prepUpdateParams({ ...data, updatedAt: timestamp }),
    };

    const result = await dynamoDb.update(params).promise();

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
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
  }
};
