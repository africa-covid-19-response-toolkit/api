'use strict';

const jwk = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const request = require('request');
const { isEmpty } = require('lodash');
const { extractTokenHeader } = require('../helpers');

// For Auth0:       https://<project>.auth0.com/
// refer to:        http://bit.ly/2hoeRXk
// For AWS Cognito: https://cognito-idp.<region>.amazonaws.com/<user pool id>
// refer to:        http://amzn.to/2fo77UI
const iss = process.env.AUTH_ISS;

// Generate policy to allow this user on this API:
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
module.exports.authorize = (event, context, cb) => {
  console.log('Auth function invoked');
  if (event.authorizationToken) {
    // Remove 'bearer ' from token:
    const token = event.authorizationToken.substring(7);

    // Get header part of token.
    const header = extractTokenHeader(token);

    if (isEmpty(header)) cb('Unauthorized');

    // Make a request to the iss + .well-known/jwks.json URL:
    request(
      { url: `${iss}/.well-known/jwks.json`, json: true },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          console.log('Request error:', error);
          cb('Unauthorized');
        }
        const keys = body;

        const k = keys.keys.find(ky => ky.kid === header.kid);

        if (isEmpty(k)) cb('Unable to find jwk');

        // Based on the JSON of `jwks` create a Pem:
        const jwkArray = {
          kty: k.kty,
          n: k.n,
          e: k.e,
        };

        const pem = jwkToPem(jwkArray);

        // Verify the token:
        jwk.verify(token, pem, { issuer: iss }, (err, decoded) => {
          const currentSeconds = Math.floor(new Date().valueOf() / 1000);

          if (err) {
            console.log('Unauthorized user:', err.message);
            cb('Unauthorized');
          } else {
            if (
              currentSeconds > decoded.exp ||
              currentSeconds < decoded.auth_time
            ) {
              console.log('access_token is expired or invalid');
              cb('Unauthorized');
            }
            if (decoded.iss !== iss) {
              console.log('access_token issuer is invalid');
              cb('Unauthorized');
            }
            if (decoded.token_use !== 'access') {
              console.log('access_token use is not access');
              cb('Unauthorized');
            }
            // cb(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
            cb(null, generatePolicy(decoded.sub, 'Allow', '*'));
          }
        });
      }
    );
  } else {
    console.log('No authorizationToken found in the header.');
    cb('Unauthorized');
  }
};
