import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createProperty } from '../../helpers/businessLogic/property'
import { CreatePropertyRequest } from '../../requests/CreatePropertyRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createDepartment')


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing createProperty event', { event })

    const newProperty: CreatePropertyRequest = JSON.parse(event.body)
    
    // Create a new Property and return a presigned URL to upload a file for the property with the provided id

    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    
    const item = await createProperty(newProperty, jwtToken)

    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ 
        item: item
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )