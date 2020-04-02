const { isEmpty } = require('lodash');
const schema = require('../schema');

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
module.exports.prepareFilterParams = (queryStringParameters, type) => {
  if (isEmpty(queryStringParameters)) return null;

  let params = {};
  let ExpressionAttributeNames = {};
  let ExpressionAttributeValues = {};
  let FilterExpression = '';

  for (const key in queryStringParameters) {
    const queryValue = queryStringParameters[`${key}`];

    // Filters starting with _ are not type related.
    // e.g _start, _limit, _sort....
    if (key.startsWith('_')) continue;

    if (!queryValue) continue;

    const field = key.split('_')[0] || key;
    const filter = { [`${field}`]: queryStringParameters[key] };

    // Validate filters against schema.
    const { value: validated, error } = schema[type].validate(filter);

    if (error)
      throw new Error(
        `${field} is not a valid filter for type: ${type}. Please refer https://github.com/Ethiopia-COVID19/api-gateway#data-structure.`
      );

    const operator = this.getFilterOperator(key.split('_')[1]);

    // Add ExpressionAttributeNames
    ExpressionAttributeNames[`#${key}`] = `${field}`;

    // ExpressionAttributeValues, set data from the validated filter instead original queryStringParameters
    // Everything value coming in through queryStringParameters is a string. During validation, '44' becomes 44 and 'true' becomes true.
    // Therefore the validated filter values have proper type.
    ExpressionAttributeValues[`:${key}`] = validated[field];

    // FilterExpression
    if (FilterExpression) {
      FilterExpression =
        `${FilterExpression} ` + 'AND' + ` #${key} ${operator} :${key}`;
    } else {
      FilterExpression = `#${key} ${operator} :${key}`;
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

// Returns dynamoDB options
module.exports.getDynamoDBOptions = () => {
  if (process.env.IS_OFFLINE) {
    return {
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    };
  }

  // passing empty object should be okay for prod
  return {}
}