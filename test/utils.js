'use strict';

const sinon = require('sinon');

module.exports = {
  event: (type) => {
    return {
      pathParameters: {
        type: type
      },
      body: '{"name":"Micheal Jackson","description": "Awesome Singer"}'
    };
  },
  context: {},
  stubAWS: (returnValue) => {
    return {
      DynamoDB: {
        DocumentClient: sinon.stub().returns(returnValue)
      }
    };
  }
};
