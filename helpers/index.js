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
