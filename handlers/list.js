'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const { getTable, prepareFilterParams } = require('../helpers');
const { isEmpty } = require('lodash');

const schema = require('../schema');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = async (event, context, callback) => {
  const {
    pathParameters: { type },
    queryStringParameters,
  } = event;

  // Collect validated filters
  const validatedFilters = {};

  // Validate filters.
  try {
    for (const key in queryStringParameters) {
      const field = key.split('_')[0] || key;
      const filter = { [`${field}`]: queryStringParameters[key] };
      const validatedFiler = await schema[type].validateAsync(filter);
      validatedFilters[key] = validatedFiler[field];
    }
  } catch (error) {
    callback(null, {
      statusCode: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Invalid filter. ${error.message}. Please refer https://github.com/Ethiopia-COVID19/api-gateway#data-structure.`,
      }),
    });
    return;
  }

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
    const filterParams = prepareFilterParams(validatedFilters);

    if (!isEmpty(filterParams)) params = { ...params, ...filterParams };

    const { Items = [], Count = 0, ScannedCount = 0 } = await dynamoDb
      .scan(params)
      .promise();

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },

      // body: JSON.stringify({ count: Count, items: Items, total: ScannedCount }),
      body: JSON.stringify([...(Items || [])]),
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

// const scan = async (params, enforcedLimit, resultSet = []) => {
//   const {
//     Items = [],
//     Count = 0,
//     ScannedCount = 0,
//     LastEvaluatedKey = null,
//   } = await dynamoDb.scan(params).promise();

//   // let count = count + Count;
//   // let total = ScanCount0;

//   const result = [...resultSet, ...Items];

//   // Determine if we need to fetch more items
//   const noEnforcedLimit = !enforcedLimit;

//   const enforcedLimitNotReached =
//     enforcedLimit && result.length < enforcedLimit;
//   const shouldGetMoreItems =
//     LastEvaluatedKey && noEnforcedLimit && enforcedLimitNotReached;

//   if (shouldGetMoreItems) {
//     const updatedParams = {
//       ...params,
//       ExclusiveStartKey: scanResult.LastEvaluatedKey,
//     };
//     await scan(updatedParams, [...resultSet, ...scanResult.Items]);
//   }

//   // Discard items if there are more than we want
//   return enforcedLimit ? result.slice(0, enforcedLimit) : result;
// };
