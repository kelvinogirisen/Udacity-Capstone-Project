import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createAttachmentPresignedUrl } from '../../helpers/businessLogic/property'
import { updatePropertyWithUrl } from '../../helpers/businessLogic/property'
import {getUserIdByToken} from '../../helpers/businessLogic/property'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const propertyId = event.pathParameters.propertyId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const userId = await getUserIdByToken(jwtToken)

    

    const uploadUrl = await createAttachmentPresignedUrl(propertyId)    
    await updatePropertyWithUrl(userId, propertyId, uploadUrl)    

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ uploadUrl: uploadUrl })
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
