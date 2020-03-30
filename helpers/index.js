const { isEmpty } = require('lodash');

/**
 * Helper function to avoid:
 * ValidationException: One or more parameter values were invalid: An AttributeValue may not contain an empty string.
 * */
module.exports.removeEmptyStringElements = obj => {
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

// Prepare filter parameters.
module.exports.prepareFilterParams = queryStringParameters => {
  if (isEmpty(queryStringParameters)) return null;

  let params = {};
  let ExpressionAttributeNames = {};
  let ExpressionAttributeValues = {};
  let FilterExpression = '';

  for (const key in queryStringParameters) {
    const queryValue = queryStringParameters[key];

    // Added to avoid:
    // ValidationException: ExpressionAttributeValues contains
    // invalid value: One or more parameter values were invalid:
    // An AttributeValue may not contain an empty string.
    if (isEmpty(queryValue)) continue;

    const field = key.split('_')[0] || key;
    const operator = this.getFilterOperator(key.split('_')[1]);

    // Add ExpressionAttributeNames
    ExpressionAttributeNames[`#${field}`] = `${field}`;

    // ExpressionAttributeValues
    ExpressionAttributeValues[`:${field}`] = queryValue;

    // FilterExpression
    if (FilterExpression) {
      FilterExpression =
        `${FilterExpression} AND #${field} ${operator} :${field}`;
    } else {
      FilterExpression = `#${field} ${operator} :${field}`;
    }
  }

  if (!isEmpty(FilterExpression)) params['FilterExpression'] = FilterExpression;
  if (!isEmpty(ExpressionAttributeNames))
    params['ExpressionAttributeNames'] = ExpressionAttributeNames;
  if (!isEmpty(ExpressionAttributeValues))
    params['ExpressionAttributeValues'] = ExpressionAttributeValues;

  return params;
};

// Returns table name for each type.
module.exports.getTable = type => {
  switch (type) {
    case 'communities':
      return process.env.COMMUNITY_TABLE;
    case 'passengers':
      return process.env.PASSENGERS_TABLE;
    case 'medical-facilities':
      return process.env.MEDICAL_FACILITY_TABLE;
    case 'surveillance':
      return process.env.SURVEILLANCE_TABLE;
    case 'toll-free':
      return process.env.TOLL_FREE_TABLE;
    default:
      return null;
  }
};

// Returns DynamoDB filter operators.
module.exports.getFilterOperator = op => {
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
module.exports.extractTokenHeader = token => {
  const tokenSections = (token || '').split('.');
  if (tokenSections.length < 2) {
    console.log('requested token is invalid');
    return null;
  }
  const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
  const header = JSON.parse(headerJSON);
  return header;
};
