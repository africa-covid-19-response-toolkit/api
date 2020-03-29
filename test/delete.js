'use strict';
const mockedEnv = require('mocked-env');
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const { context, stubAWS } = require('./utils.js');

const event = {
  'pathParameters': {
    'type':'passengers',
    'id': 'fake-id'
  }
};

describe('Delete tests', () => {
  let stubbedHandler;
  let stubDelete;
  let restore;
  before(() => {
    stubDelete = sinon.stub();
    const AWS = stubAWS({delete:stubDelete});
    stubbedHandler = proxyquire('../handlers/delete.js', {
        'aws-sdk': AWS
    });
  });

  afterEach(() => {
    if (restore) {
      restore();
    }
  });

  it('should delete from DB', (done) => {
    restore = mockedEnv({
      PASSENGERS_TABLE: 'PassengerReports',
    });

    stubDelete.withArgs().yields(null, null);

    stubbedHandler.delete(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(200);
      expect(data.body).to.eql(JSON.stringify({}));
      done();
    });
  });

  it('should fail if table doesnt exist', (done) => {
    stubDelete.withArgs().yields(null, event.body);

    stubbedHandler.delete(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(400);
      expect(data.body.message).to.eql('Unknown type provided. Type name: passengers');
      done();
    });
  });

  it('should return status 500 if DB delete fails', (done) => {
    restore = mockedEnv({
      PASSENGERS_TABLE: 'PassengerReports',
    });

    const expectError = new Error('failed to delete');

    stubDelete.withArgs().yields(expectError, null);

    stubbedHandler.delete(event, context, (ctx, data) => {
      expect(data.statusCode).to.eql(501);
      expect(data.body.message).to.eql('Couldn\'t remove the passengers item.');
      done();
    });
  });
});
