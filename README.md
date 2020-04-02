<!--
title: 'Ethiopia COVID-19 API Gateway'
description: 'This API will be utilised by all applications that need to write/retrieve Ethiopia Covid19 data. E.g. covid19.et project will use it to retrieve data for dashboard and write data.'
layout: Doc
framework: v1
platform: AWS
language: nodeJS
-->
# API for writing/retrieving COVID-19 data

This API will be utilised by all applications that need to write/retrieve Ethiopia Covid19 data. E.g. [covid19.et](https://github.com/Ethiopia-COVID19/Covid19.ET) project will use it to retrieve data for dashboard and write data


## Serverless REST API

This example demonstrates how to setup a [RESTful Web Services](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) allowing you to create, list, get, update and delete Community. DynamoDB is used to store the data. This is just an example and of course you could use any data storage as a backend.

## [Structure](#structure)

This service has a separate directory for all the community operations. For each operation exactly one file exists e.g. `handler/delete.js`. In each of these files there is exactly one function which is directly attached to `module.exports`.

The idea behind the `communities` directory is that in case you want to create a service containing multiple resources e.g. users, notes, comments you could do so in the same service. While this is certainly possible you might consider creating a separate service for each resource. It depends on the use-case and your preference.

### Use-cases

- API for a Web Application
- API for a Mobile Application

### Setup

```bash
npm install

# Run dev
npm run dev
```

### Debug
In VSCODE: Activity Bar > Run > sls debug OR a shortcut is F5

### Deploy

In order to deploy the endpoint simply run

```bash
serverless deploy
```

API Documentation
https://documenter.getpostman.com/view/370266/SzYW3L6e?version=latest


[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/64e612b7b58fd9352206)

---
## [Auth Flow](#auth-flow)

```
client_id = {value}
client_secret = {value}
```

Ping @Naod on Slack to get the values above

Generate base64 key by using the `client_id` and `client_secret`

```
$ echo -n 'client_id:client_secret' | openssl base64
Node example:
const AUTHORIZATION_KEY = Buffer.from('process.env.CLIENT_ID:process.env.CLIENT_SECRET').toString('base64')
```

Send a request to the auth endpoint to get an access token:

```
curl --location --request POST 'https://ethiopia-covid19.auth.us-east-2.amazoncognito.com/oauth2/token' \
--header 'Authorization: Basic abc123==' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials'
```

response body:

```
{
    "access_token": "long_token_value",
    "expires_in": 3600,
    "token_type": "Bearer"
}
```

Make a request to the API:

```
curl --location --request GET 'https://api.ethiopia-covid19.com/gateway/communities' \
--header 'Authorization: Bearer long_string' \
--header 'Content-Type: application/json'
```

Once you authenticate, use the `Access Token` as a `Bearer` authorization using Postman. 

In case you expect a lot of traffic fluctuation we recommend to checkout this guide on how to auto scale DynamoDB [https://aws.amazon.com/blogs/aws/auto-scale-dynamodb-with-dynamic-dynamodb/](https://aws.amazon.com/blogs/aws/auto-scale-dynamodb-with-dynamic-dynamodb/)

Please note: This API supports the following types:
- `communities`
- `passengers`
- `medical-facilities`
- `surveillance`
- `community-report`
- `toll-free`
---

## [Data Structure](#data-structure)

### Community
```
{
  "id": "123e4567-e89b-12d3-a456-426655440000",
  "firstName": "asdfa",
  "lastName": "asdf",
  "age": "5",
  "sex": "Male",
  "language": "",
  "region": "Addis Ababa",
  "subcityOrZone": "",
  "sefer": "",
  "woreda": "",
  "kebele": "",
  "houseNo": "",
  "phoneNo": "1231231",
  "latitude": 38.9071923,
  "longitude": -77.0368707,
  "fever": true,
  "cough": true,
  "shortnessOfBreath": true,
  "formStatus": "Incomplete",
  "travelHx": true,
  "haveSex": true,
  "animalMarket": true,
  "healthFacility": false,
  "occupation": "Merchant(Animal)",
  "dataSource": "bot"
}
```

### Passengers
```
{
  "id": "123e4567-e89b-12d3-a456-426655440000",
  "firstName": "asdfas",
  "middleName": "dasdfas",
  "lastName": "dasdfasd",
  "gender": "Female",
  "dateOfBirth": "0100-01-01",
  "nationality": "Åland Islands",
  "passportNo": "asdfasdfa",
  "travelFrom": "Algeria",
  "phoneNo": "sdfasdfasdfasdf",
  "hotelName": "Ghion Hotel",
  "flightNumber": "asdfas",
  "seatNumber": "dfasdfasdf",
  "transitFrom": "Albania",
  "fever": true,
  "shortnessOfBreath": true,
  "cough": true,
  "dependents": [
    {
      "firstName": "asdfasdf",
      "middleName": "asdfasd",
      "lastName": "fasdfasd",
      "gender": "Female",
      "dateOfBirth": "",
      "nationality": "Albania",
      "passportNo": "asdfasdf",
      "seatNumber": "asdfasdfasda",
      "fever": true,
      "shortnessOfBreath": true,
      "cough": true,
      "travelFrom": "Algeria",
      "transitFrom": "Albania",
      "phoneNo": "sdfasdfasdfasdf",
      "flightNumber": "asdfas",
      "selectedLanguage": "English"
    },
    {
      "firstName": "asdfa",
      "middleName": "sdfasdf",
      "lastName": "asdfasdfa",
      "gender": "Female",
      "dateOfBirth": "3333-03-02",
      "nationality": "Åland Islands",
      "passportNo": "asdfasdf",
      "seatNumber": "asdfasdf",
      "fever": true,
      "shortnessOfBreath": true,
      "cough": true,
      "travelFrom": "Algeria",
      "transitFrom": "Albania",
      "phoneNo": "sdfasdfasdfasdf",
      "flightNumber": "asdfas",
      "selectedLanguage": "English"
    }
  ],
  "otherHotelName": "",
  "email": "asdfasdf@asdfa.com",
  "language": ""
}
```

### Medical Facilities
```
{
  "id": "123e4567-e89b-12d3-a456-426655440000",
  "firstName": "string",
  "middleName": "string",
  "lastName": "string",
  "nationality": "string",
  "email": "string",
  "sex": "string",
  "age": 0,
  "region": "string",
  "subcity": "string",
  "zone": "string",
  "woreda": "string",
  "kebele": "string",
  "houseNumber": "string",
  "phoneNumber": "string",
  "occupation": "string",
  "callDate": "2020-03-29T00:52:45.527Z",
  "callerType": "string",
  "fever": true,
  "cough": true,
  "headache": true,
  "runnyNose": true,
  "feelingUnwell": true,
  "shortnessOfBreath": true,
  "bodyPain": true,
  "travelHx": true,
  "haveSex": true,
  "animalMarket": true,
  "healthFacility": true,
  "receiverName": "string",
  "source": "string",
  "formStatus": "string"
}
```

### Toll Free
```
{
  "id": "123e4567-e89b-12d3-a456-426655440000",
  "firstName": "string",
  "middleName": "string",
  "lastName": "string",
  "age": 26,
  "gender": "Male",
  "reportRegion": {
    "id": 1,
    "name": "string"
  },
  "region": {
    "id": 9,
    "name": "SNNP Regional State",
    "latitude": 9.005401,
    "longitude": 38.763611,
    "description": null,
    "createdAt": "2020-03-29T11:09:10+03:00",
    "updatedAt": "2020-03-29T11:09:10+03:00",
    "deletedAt": null
  },
  "zone": {
    "id": 1,
    "name": "string"
  },
  "woreda": {
    "id": 1,
    "name": "string"
  },
  "city": {
    "id": 1,
    "name": "string"
  },
  "subcity": {
    "id": 1,
    "name": "string"
  },
  "kebele": {
    "id": 1,
    "name": "string"
  },
  "createdBy": {
    "id": 1,
    "firstName": "string",
    "middleName": "string",
    "lastName": "string",
    "email": "george.beng@gmail.com",
    "phoneNumber": "string",
    "region": {
      "id": 9,
      "name": "SNNP Regional State",
      "latitude": 9.005401,
      "longitude": 38.763611,
      "description": null,
      "createdAt": "2020-03-29T11:09:10+03:00",
      "updatedAt": "2020-03-29T11:09:10+03:00",
      "deletedAt": null
    },
    "role": {
      "id": 1,
      "name": "string"
    },
    "callCenter": {
      "id": 1,
      "name": "string"
    },
    "active": true,
    "emailVerifiedAt": null,
    "createdAt": "2020-03-29T11:09:10+03:00",
    "updatedAt": "2020-03-29T11:09:10+03:00",
    "deletedAt": null
  },
  "phoneNumber": "251911241285",
  "secondPhoneNumber": "string",
  "occupation": null,
  "callerType": null,
  "other": null,
  "reportType": "Sign-Symptom",
  "reportGroup": {
    "id": 1,
    "name": "string"
  },
  "description": null,
  "remark1": null,
  "remark2": null,
  "travelHx": true,
  "haveSex": true,
  "visitedAnimal": true,
  "visitedHf": false,
  "createdAt": "2020-03-29T11:09:10+03:00",
  "updatedAt": "2020-03-29T11:09:10+03:00",
  "deletedAt": null,
  "rumorTypes": []
}
```

### Surveillance
```
{
  "id": "123e4567-e89b-12d3-a456-426655440000",
  "firstName": "string",
  "middleName": "string",
  "lastName": "string",
  "nationality": "string",
  "email": "string",
  "sex": "string",
  "age": 0,
  "region": "string",
  "subcity": "string",
  "zone": "string",
  "woreda": "string",
  "kebele": "string",
  "houseNumber": "string",
  "phoneNumber": "string",
  "occupation": "string",
  "callDate": "2020-03-29T00:52:45.527Z",
  "callerType": "string",
  "fever": true,
  "cough": true,
  "headache": true,
  "runnyNose": true,
  "feelingUnwell": true,
  "shortnessOfBreath": true,
  "bodyPain": true,
  "travelHx": true,
  "haveSex": true,
  "animalMarket": true,
  "healthFacility": true,
  "receiverName": "string",
  "source": "string",
  "formStatus": "string"
}
```
---

## [Scaling](#scaling)

### AWS Lambda

By default, AWS Lambda limits the total concurrent executions across all functions within a given region to 100. The default limit is a safety limit that protects you from costs due to potential runaway or recursive functions during initial development and testing. To increase this limit above the default, follow the steps in [To request a limit increase for concurrent executions](http://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html#increase-concurrent-executions-limit).

### DynamoDB

When you create a table, you specify how much provisioned throughput capacity you want to reserve for reads and writes. DynamoDB will reserve the necessary resources to meet your throughput needs while ensuring consistent, low-latency performance. You can change the provisioned throughput and increasing or decreasing capacity as needed.

This is can be done via settings in the `serverless.yml`.

```yaml
  ProvisionedThroughput:
    ReadCapacityUnits: 1
    WriteCapacityUnits: 1
```
