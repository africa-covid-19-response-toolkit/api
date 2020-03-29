'use strict';
const mockedEnv = require('mocked-env');
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const event = require('./utils.js').event('passengers');
const { context, stubAWS } = require('./utils.js');

describe('Create tests', () => {
  let stubbedHandler;
  let stubPut;
  let restore;

  before(() => {
    stubPut = sinon.stub();
    const AWS = stubAWS({put: stubPut});
    stubbedHandler = proxyquire('../handlers/create.js', {
        'aws-sdk': AWS
    });
  });

  afterEach(() => {
    if (restore) {
      restore();
    }
  });
  
  it('should write to DB', (done) => {
    restore = mockedEnv({
      PASSENGERS_TABLE: 'PassengerReports',
    });

    stubPut.withArgs().yields(null, event.body);

    stubbedHandler.create(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(201);
      expect(JSON.parse(data.body)).to.include(JSON.parse(event.body));
      done();
    });
	});

  it('should fail if table doesnt exist', (done) => {
    stubPut.withArgs().yields(null, event.body);

    stubbedHandler.create(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(400);
      expect(data.body.message).to.eql('Unknown type provided. Type name: passengers');
      done();
    });
  });

  it('should return status 500 if DB create fails', (done) => {
    restore = mockedEnv({
      PASSENGERS_TABLE: 'PassengerReports',
    });

    const expectError = new Error('failed to create');

    stubPut.withArgs().yields(expectError, null);

    stubbedHandler.create(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(501);
      expect(data.body.message).to.eql('Couldn\'t create the passengers item.');
      done();
    });
  });
});
