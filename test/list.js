/* eslint-env mocha */
'use strict';
const mockedEnv = require('mocked-env');
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const event = require('./utils.js').event('passengers');
const { context, stubAWS } = require('./utils.js');

describe('List tests', () => {
  let stubbedHandler;
  let stubScan;
  let restore;
  before(() => {
    stubScan = sinon.stub();
    const AWS = stubAWS({scan : stubScan});
    stubbedHandler = proxyquire('../handlers/list.js', {
        'aws-sdk': AWS
    });
  });

  afterEach(() => {
    if (restore) {
      restore();
    }
  });

  it('should scan from DB', (done) => {
    restore = mockedEnv({
      PASSENGERS_TABLE: 'PassengerReports',
    });
    const eventBody = JSON.parse(event.body);
    const expectedResult = {'Items': {...eventBody}};
    stubScan.withArgs().yields(null, expectedResult);

    stubbedHandler.list(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(200);
      expect(JSON.parse(data.body)).to.include(JSON.parse(event.body));
      done();
    });
  });

  it('should fail if table doesnt exist', (done) => {
    stubScan.withArgs().yields(null, event.body);

    stubbedHandler.list(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(400);
      expect(data.body.message).to.eql('Unknown type provided. Type name: passengers');
      done();
    });
  });

  it('should return status 500 if DB scan fails', (done) => {
    restore = mockedEnv({
      PASSENGERS_TABLE: 'PassengerReports',
    });

    const expectError = new Error('failed to create');

    stubScan.withArgs().yields(expectError, null);

    stubbedHandler.list(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(501);
      expect(data.body.message).to.eql('Couldn\'t fetch the passengers.');
      done();
    });
  });
});
