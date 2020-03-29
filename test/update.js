'use strict';

const mockedEnv = require('mocked-env');
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const event = require('./utils.js').event('passengers');
const { context, stubAWS } = require('./utils.js');

describe('Update tests', () => {
  let stubbedHandler;
  let stubUpdate;
  let restore;
  before(() => {
    stubUpdate = sinon.stub();
    const AWS = stubAWS({update : stubUpdate});

    stubbedHandler = proxyquire('../handlers/update.js', {
        'aws-sdk': AWS
    });
  });

  afterEach(() => {
    if (restore) {
      restore();
    }
  });

  it('should update to DB', (done) => {
    restore = mockedEnv({
      PASSENGERS_TABLE: 'PassengerReports',
    });

    const eventBody = JSON.parse(event.body);
    const expectedResult = {'Attributes': {...eventBody}};

    stubUpdate.withArgs().yields(null, expectedResult);

    stubbedHandler.update(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(200);
      expect(JSON.parse(data.body)).to.include(JSON.parse(event.body));
      done();
    });
	});

  it('should fail if table doesnt exist', (done) => {
    stubUpdate.withArgs().yields(null, event.body);

    stubbedHandler.update(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(400);
      expect(data.body.message).to.eql('Unknown type provided. Type name: passengers');
      done();
    });
  });

  it('should return status 500 if DB update fails', (done) => {
    restore = mockedEnv({
      PASSENGERS_TABLE: 'PassengerReports',
    });

    const expectError = new Error('failed to create');

    stubUpdate.withArgs().yields(expectError, null);

    stubbedHandler.update(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(501);
      expect(data.body.message).to.eql('Couldn\'t fetch the passengers item.');
      done();
    });
  });
});
