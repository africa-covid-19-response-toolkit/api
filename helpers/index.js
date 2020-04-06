const {
  Community,
  Passenger,
  MedicalFacility,
  Surveillance,
  TollFree,
} = require('../models');

/**
 * Helper function to avoid:
 * ValidationException: One or more parameter values were invalid: An AttributeValue may not contain an empty string.
 * */
module.exports.removeEmptyStringElements = (obj) => {
  for (var prop in obj) {
    if (typeof obj[prop] === 'object') {
      // dive deeper in
      this.removeEmptyStringElements(obj[prop]);
    } else if (obj[prop] === '') {
      // delete elements that are empty strings
      delete obj[prop];
    }
  }
  return obj;
};

/**
 * Helper function to dynamically build an update param for DynamoDb.
 * @param {Object} data Actual data to be added.
 * @param {String} ReturnValues ReturnValues param.
 */
module.exports.prepUpdateParams = (data, ReturnValues = 'ALL_NEW') => {
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  let UpdateExpression = '';
  const structure = [];

  for (const key in data) {
    // Ignore id since it's automatically generated.
    if (key === 'id') continue;
    // Ignore createdAt, we don't update this.
    if (key === 'createdAt') continue;

    const attr = `#attr_${key}`;
    ExpressionAttributeNames[attr] = `${key}`;
    ExpressionAttributeValues[`:${key}`] = data[key];
    structure.push(`${attr} = :${key}`);
  }

  UpdateExpression = `SET ${structure.join(', ')}`;
  return {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    UpdateExpression,
    ReturnValues,
  };
};

// Returns a DocumentDB for each type.
module.exports.getModel = (type) => {
  switch (type) {
    case 'communities':
      return Community;
    case 'passengers':
      return Passenger;
    case 'medical-facilities':
      return MedicalFacility;
    case 'surveillance':
      return Surveillance;
    case 'toll-free':
      return TollFree;
    default:
      return null;
  }
};

// Returns DynamoDB filter operators.
module.exports.getFilterOperator = (op) => {
  switch (op) {
    case 'eq':
      return '=';
    case 'ne':
      return '<>';
    case 'lt':
      return '<';
    case 'gt':
      return '>';
    case 'gte':
      return '>=';
    case 'lt':
      return '<';
    case 'lte':
      return '<=';
    default:
      return '=';
  }
};

// Returns JWT header.
module.exports.extractTokenHeader = (token) => {
  const tokenSections = (token || '').split('.');
  if (tokenSections.length < 2) {
    console.log('requested token is invalid');
    return null;
  }
  const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
  const header = JSON.parse(headerJSON);
  return header;
};

module.exports.handleResponse = (callback, body, statusCode = 200) => {
  const response = {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
  callback(null, response);
  return;
};

module.exports.handleError = (callback, name, error = '') => {
  const response = {
    statusCode: error.statusCode || 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      message: `Something went wrong`,
    }),
  };
  switch (name) {
    case 'noModelFound':
      response.body = JSON.stringify({
        message: error.message || 'Unknown type provided.',
      });
      break;
    case 'ValidationError':
      response.body = JSON.stringify({
        message: error.message || 'Validation error occurred',
      });
      break;
    default:
      break;
  }
  callback(null, response);
};
