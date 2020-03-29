'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const { getTable } = require('../helpers');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  const {
    pathParameters: { type, id },
    queryStringParameters
  } = event;

  const table = getTable(type);

  if (!table) {
    callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: { message: `Unknown type provided. Type name: ${type}` },
    });
  }

  if (queryStringParameters) {
    const scanFilter = {};
    Object.keys(queryStringParameters).forEach((key) => {
      scanFilter[key] = {
        ComparisonOperator: 'EQ',
        AttributeValueList: [
          queryStringParameters[key]
        ]
      }
    });

    const filterParams = {
      TableName: table,
      ScanFilter: scanFilter
    }

    // TODO: can we use something other than scan?
    dynamoDb.scan(filterParams, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: { message: `Couldn't fetch the ${type} item.` },
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
        body: JSON.stringify(result.Item || {}),
      };
      callback(null, response);
    });
  }

  const params = {
    TableName: table,
    Key: {
      id,
    },
  };

  // fetch {type} from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: { message: `Couldn't fetch the ${type} item.` },
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
      body: JSON.stringify(result.Item || {}),
    };
    callback(null, response);
  });
};
