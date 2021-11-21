import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Property } from '../../models/Property'
import { PropertyUpdate } from '../../models/PropertyUpdate'
import { createLogger } from '../../utils/logger'
const AWSXRay = require('aws-xray-sdk');

const logger = createLogger('Property-access')

const XAWS = AWSXRay.captureAWS(AWS);

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    AWSXRay.setContextMissingStrategy('LOG_ERROR')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      sslEnabled: false
    })
  }
  return new XAWS.DynamoDB.DocumentClient()
}


export class PropertyAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly PropertyTable = process.env.PROPERTY_TABLE,
  ) {}

  async getProperty(propertyId: string, userId: string): Promise<Property> {
   const result = await this.docClient.query({
        TableName: this.PropertyTable,
        KeyConditionExpression: 'propertyId = :propertyId AND userId = :userId',
        ExpressionAttributeValues: {
            ':propertyId': propertyId,
            ':userId': userId
        }
    }).promise()
    
    return result.Items[0] as Property
}

  async getProperties(userId: string): Promise<Property[]> {
    logger.info(`Getting all Property items for user ${userId}`)

    const result = await this.docClient
      .query({
        TableName: this.PropertyTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items

    return items as Property[]
  }

  async createProperty(property: Property): Promise<Property> {
    await this.docClient
      .put({
        TableName: this.PropertyTable,
        Item: property
      })
      .promise()

    return property
  }

  async updateProperty(userId: string, propertyId: string, updateProperty: PropertyUpdate): Promise<PropertyUpdate> {    
    await this.docClient.update({
      TableName: this.PropertyTable,
      Key: { userId, propertyId },
      ExpressionAttributeNames: { "#N": "title" },
      UpdateExpression: "set #N=:PropertyTitle, description=:description, type=:type, location=:location, expireDate=:expireDate done=:done", 
      ExpressionAttributeValues: {
        ":Propertytitle": updateProperty.title,
        ":description": updateProperty.description,
        ":type": updateProperty.type,
        ":location": updateProperty.location,        
        ":expireDate": updateProperty.expireDate,
        ":done": updateProperty.done
      },
      ReturnValues: "UPDATED_NEW"
    })
    .promise();
    
    return updateProperty
  }

  async deleteProperty(propertyId: string, userId: string) {
    const result = await this.getProperty(userId, propertyId)

    if (result) {
      const key = {
          userId: result.userId,
          propertyId: result.propertyId
      }
      await this.docClient.delete({
        TableName: this.PropertyTable,
        Key: key
      }).promise()
    }
  }
  

  async updatePropertyWithUrl(userId: string, propertyId: string, uploadUrl: string): Promise<string>{
    await this.docClient.update({
      TableName: this.PropertyTable,
      Key: { userId, propertyId },
      UpdateExpression: "set attachmentUrl=:URL",
      ExpressionAttributeValues: {
        ":URL": uploadUrl.split("?")[0]
    },
    ReturnValues: "UPDATED_NEW"
    })
    .promise();

    return uploadUrl
  }

}

