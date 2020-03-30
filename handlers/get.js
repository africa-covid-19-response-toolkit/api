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

  const commonParams = {
    TableName: table,
  }
  
  if (queryStringParameters) {
    const scanFilter = {};
    // e.g. firstName_eq=test
    for (queryPram in queryStringParameters) {
      // Default to equals if no comparison param passed
      let comparisonOperator = 'EQ'
      let attributeName = queryPram
      if (/_/.test(queryPram)) {
        // assume last suffix after "_" is the comparison operator
        const _comparisonOperator = queryPram.split('_').pop()
        attributeName = attributeName.replace(`_${_comparisonOperator}`)
        comparisonOperator = _comparisonOperator.toUpperCase()
      }
      scanFilter[queryPram] = {
        ComparisonOperator: comparisonOperator,
        AttributeValueList: [
          queryStringParameters[queryPram]
        ]
      }
    };

    const filterParams = {
      ...commonParams,
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
    ...commonParams,
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
