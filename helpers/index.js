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
  const ExpressionAttributeValues = {};
  let UpdateExpression = '';
  const structure = [];

  for (const key in data) {
    if (key === 'id') continue;
    const label = `:${key}`;
    ExpressionAttributeValues[label] = data[key];
    structure.push(`${key} = ${label}`);
  }

  UpdateExpression = `SET ${structure.join(', ')}`;
  return {
    ExpressionAttributeValues,
    UpdateExpression,
    ReturnValues,
  };
};

// Returns table name for each type.
module.exports.getTable = type => {
  switch (type) {
    case 'communities':
      return process.env.COMMUNITY_TABLE;
    case 'travellers':
      return process.env.TRAVELERS_TABLE;
    default:
      return null;
  }
};
