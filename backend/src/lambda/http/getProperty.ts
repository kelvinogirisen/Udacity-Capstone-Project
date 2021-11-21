import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

import { getPropertyForUser } from '../../helpers/businessLogic/property'


const logger = createLogger('getProperty')

// Property: Get all PROPERTY items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    logger.info('Processing getProperty event', { event })

    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const propertyItems = await getPropertyForUser(jwtToken)

    if (propertyItems.length !== 0) {   
      return {
        statusCode: 201,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ items: propertyItems })
      }
    }    
  })

handler.use(
  cors({
    credentials: true
  })
)
