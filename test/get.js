'use strict';
const mockedEnv = require('mocked-env');
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const event = require('./utils.js').event('passengers');
const { context, stubAWS } = require('./utils.js');

describe('Get tests', () => {
  let stubbedHandler;
  let stubGet;
  let restore;
  before(() => {
    stubGet = sinon.stub();
    const AWS = stubAWS({get : stubGet});
    stubbedHandler = proxyquire('../handlers/get.js', {
        'aws-sdk': AWS
    });
  });

  afterEach(() => {
    if (restore) {
      restore();
    }
  });

  it('should get from DB', (done) => {
    restore = mockedEnv({
      PASSENGERS_TABLE: 'PassengerReports',
    });
    const eventBody = JSON.parse(event.body);
    const expectedResult = {'Item':{...eventBody}};
    stubGet.withArgs().yields(null, expectedResult);

    stubbedHandler.get(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(200);
      expect(JSON.parse(data.body)).to.include(JSON.parse(event.body));
      done();
    });
  });

  it('should fail if table doesnt exist', (done) => {
    stubGet.withArgs().yields(null, event.body);

    stubbedHandler.get(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(400);
      expect(data.body.message).to.eql('Unknown type provided. Type name: passengers');
      done();
    });
  });

  it('should return status 500 if DB get fails', (done) => {
    restore = mockedEnv({
      PASSENGERS_TABLE: 'PassengerReports',
    });

    const expectError = new Error('failed to create');

    stubGet.withArgs().yields(expectError, null);

    stubbedHandler.get(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(501);
      expect(data.body.message).to.eql('Couldn\'t fetch the passengers item.');
      done();
    });
  });
});
