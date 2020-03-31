'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const { getTable, prepareFilterParams } = require('../helpers');
const { isEmpty, slice } = require('lodash');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = async (event, context, callback) => {
  const {
    pathParameters: { type },
    queryStringParameters,
  } = event;

  const table = getTable(type);

  if (!table)
    callback(null, {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Unknown type provided. Type name: ${type}`,
      }),
    });

  let params = {
    TableName: table,
  };

  try {
    // Prepare filter parameters.
    try {
      const filterParams = prepareFilterParams(queryStringParameters, type);
      if (!isEmpty(filterParams)) params = { ...params, ...filterParams };
    } catch (error) {
      callback(null, {
        statusCode: error.statusCode || 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error.message),
      });
      return;
    }

    let results = [];

    const unfoldAsync = (transform, initial) =>
      transform(initial).then(next => next && unfoldAsync(transform, next));

    // Recursively scan for all documents.
    // DynamoDB Scan only limits to 1MB of data so in order to get all,
    // Do it recursively.
    // TODO: Find a better approach.
    await unfoldAsync(lastEvaluatedKey =>
      scan(params, lastEvaluatedKey).then(data => {
        results = [...results, ...data.Items];
        return data.LastEvaluatedKey;
      })
    );

    const start = parseInt(queryStringParameters._start) || 0;
    const limit = parseInt(queryStringParameters._limit) || 0;

    // Since we have the entire data paginate using array slice.
    // TODO: Find a better solution or consider using other DB with OFFSET capability.
    const result = slice(results, start, start + limit || results.length);
    const resultObject = {
      count: result.length || 0,
      result: result || [],
    };

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(resultObject),
    };
    callback(null, response);
  } catch (error) {
    console.error(error.message);
    callback(null, {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Couldn't fetch the ${type}. ${error.message}`,
      }),
    });
  }
};

const scan = (params, lastEvaluatedKey) =>
  dynamoDb
    .scan({
      ...params,
      Limit: 50,
      ExclusiveStartKey: lastEvaluatedKey,
    })
    .promise();
