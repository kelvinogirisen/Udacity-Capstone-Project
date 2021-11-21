import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateProperty, getUserIdByToken} from '../../helpers/businessLogic/property'
import { UpdatePropertyRequest } from '../../requests/UpdatePropertyRequest'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const propertyId = event.pathParameters.propertyId
    const updatedProperty: UpdatePropertyRequest = JSON.parse(event.body)
    // TODO: Update a Student item with the provided id using values in the "updatedTodo" 

    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const userId = await getUserIdByToken(jwtToken)    

    const updatedItem = await updateProperty(updatedProperty, userId, propertyId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        updatedItem: updatedItem
      })
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
