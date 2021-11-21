# Serverless Property/Rental Listing Application

This Capstone project is part of the Udacity Cloud Developer Nanodegree program. It is a simple Property/Rental Listing application implemented using AWS Lambda and Serverless framework. 

# Functionality of the application

This application allows creating/removing/updating/fetching Listing items. Each listing item can optionally have an attachment image. Each user only has access to list items that he/she has created.

# Listing items

The application stores Listing items, and each item contains the following fields:

* `propertyId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `title` (string) - title of a listing item (e.g. "8 Bedroom Apartment")
* `description` (string) - nice description of the listing item for sale or rent
* `type` (string) - the type of listing (e.g duplex, bungalow, highrise etc)
* `location` (string) - location where the listing item can be found
* `expireDate` (string) - expected date when the listing can be deleted from records
* `done` (boolean) - true if an item was sold or rented, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a listing item

The application also stores the id of the user who created a listing item.

## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@2.21.1
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login
   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```
   
# Functions that was implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetProperty` - should return all TODOs for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "items": [
        {
            "expireDate": "2021-11-28",
            "location": "Abuja",
            "propertyId": "40536513-8ab2-4fdf-a39a-12ff7cb4f2f4",
            "attachmentUrl": "https://serverless-capstone-property-images-dev-us-east-2.s3.us-east-2.amazonaws.com/40536513-8ab2-4fdf-a39a-12ff7cb4f2f4.png",
            "userId": "google-oauth2|112074014420285699039",
            "createdAt": "2021-11-21T13:27:26.450Z",
            "description": "Nice and beautiful 8 bedroom duplex with swimming pool and golf course for sale at $50000",
            "done": false,
            "title": "8 Bedroom Duplex",
            "type": "Duplex"
        },
        {
            "expireDate": "2021-11-28",
            "location": "New York",
            "propertyId": "7d3aeddb-b131-4890-ad47-6c64b6c18690",
            "attachmentUrl": "https://serverless-capstone-property-images-dev-us-east-2.s3.us-east-2.amazonaws.com/7d3aeddb-b131-4890-ad47-6c64b6c18690.png",
            "userId": "google-oauth2|112074014420285699039",
            "createdAt": "2021-11-21T08:45:19.878Z",
            "description": "A property with all the taste of comfort for a family that love vacation",
            "done": true,
            "title": "5 Bedroom Duplex",
            "type": "Duplex"
        },
        {
            "expireDate": "2021-11-20",
            "location": "Lagos",
            "propertyId": "cf8a6795-c9fc-4936-a47a-704157fe2cfd",
            "attachmentUrl": "https://serverless-capstone-property-images-dev-us-east-2.s3.us-east-2.amazonaws.com/cf8a6795-c9fc-4936-a47a-704157fe2cfd.png",
            "userId": "google-oauth2|112074014420285699039",
            "createdAt": "2021-11-20T22:53:56.395Z",
            "description": "Nice four bedroom apartment located in a serene evironment",
            "done": false,
            "title": "4 Bedroom Bundalow",
            "type": "Bungalow"
        }
    ]
}
}
```

* `CreateProperty` - should create a new listing item for a current user. A shape of data send by a client application to this function can be found in the `CreatePropertyRequest.ts` file

It receives a new listing item to be created in JSON format that looks like this:

```json
{
	"title": "2 Bedroom Flat",
	"description": "A beautiful 2 bedroom apartment located in a serene environment", 
	"type": "Bungalow", 
	"location": "Abuja"
}
```

It should return a new TODO item that looks like this:

```json
{
  "item": {
    "propertyId": "123",
    "title": "2 Bedroom Flat",
	  "description": "A beautiful 2 bedroom apartment located in a serene environment", 
	  "type": "Bungalow", 
	  "location": "Lagos"
  }
}
```

* `UpdateProperty` - should update a listing item created by a current user. A shape of data send by a client application to this function can be found in the `UpdatePropertyRequest.ts` file

It receives an object that contains fields that can be updated in a listing item:

```json
{
  "title": "2 Bedroom Flat",
	"description": "A beautiful 2 bedroom apartment located in a serene environment", 
	"type": "Bungalow", 
	"location": "Accra",
  "done": true
}
```

The id of an listing item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeleteProperty` - should delete a listing item created by a current user. Expects an id of a listing item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a listing item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You can also add any necessary resources to the `resources` section of the `serverless.yml` file such as Aws Elastic search and SNS notification.


# Frontend

The `client` folder contains a web application that uses an API tto connect to the backend.

This frontend works with the serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures the  client application with an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication in this application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. I recommend using asymmetrically encrypted JWT tokens.

## Logging

The application is configured with [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```

# Suggestions

To store listing items, you might want to use a DynamoDB table with local secondary index(es). A create a local secondary index you need to create a DynamoDB resource like this:

```yml

PropertysTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: partitionKey
        AttributeType: S
      - AttributeName: sortKey
        AttributeType: S
      - AttributeName: indexKey
        AttributeType: S
    KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.PROPERTY_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.INDEX_NAME}
        KeySchema:
          - AttributeName: partitionKey
            KeyType: HASH
          - AttributeName: indexKey
            KeyType: RANGE
        Projection:
          ProjectionType: ALL # What attributes will be copied to an index

```

To query an index you need to use the `query()` method like:

```ts
await this.dynamoDBClient
  .query({
    TableName: 'table-name',
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  })
  .promise()
```

# How to run the application

## Backend

To deploy this application run the following commands with a user configured with appropriate permissions:

```
cd backend
npm install
serverless deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Postman collection

An alternative way to test this API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. 
