import { PropertyAccess } from '../../helpers/dataLayer/propertyAccess'
import { AttachmentAccess } from '../../helpers/fileStorage/attachmentUtils';
import { Property } from '../../models/Property'
import { PropertyUpdate } from '../../models/PropertyUpdate'
import { parseUserId } from '../../auth/utils'
import { CreatePropertyRequest } from '../../requests/CreatePropertyRequest'
import { UpdatePropertyRequest } from '../../requests/UpdatePropertyRequest'

import * as uuid from 'uuid'


// TODO: Implement businessLogic

const propertyAccess = new PropertyAccess()
const attachmentAccess = new AttachmentAccess()

export async function getProperty(propertyId: string, userId: string): Promise<Property> {
  return await propertyAccess.getProperty(propertyId, userId)
}

export async function getPropertyForUser(jwtToken: string): Promise<Property[]> {
  const userId = parseUserId(jwtToken)
  return await propertyAccess.getProperties(userId)
}

export async function getUserIdByToken(jwtToken: string): Promise<string> {
  return parseUserId(jwtToken)
}

export async function createProperty(
  createPropertyRequest: CreatePropertyRequest,
  jwtToken: string
): Promise<Property> {

  const userId = parseUserId(jwtToken)
  const propertyId = uuid.v4()

  return await propertyAccess.createProperty({
    userId: userId,
    propertyId: propertyId,
    createdAt: new Date().toISOString(),
    title: createPropertyRequest.title,
    description: createPropertyRequest.description,
    type: createPropertyRequest.type,
    location: createPropertyRequest.location,
    expireDate: createPropertyRequest.expireDate,
    done: false,
    attachmentUrl: ''
  })
}

export async function updateProperty(
  updatePropertyRequest: UpdatePropertyRequest,
  userId: string, 
  propertyId: string
): Promise<PropertyUpdate> {
  return await propertyAccess.updateProperty(userId, propertyId, {
    title: updatePropertyRequest.title,
    description: updatePropertyRequest.description,
    type: updatePropertyRequest.type,
    location: updatePropertyRequest.location,
    expireDate: updatePropertyRequest.expireDate,
    done: updatePropertyRequest.done,
  })
}

export async function deleteProperty(propertyId: string, userId: string) {   
    return await propertyAccess.deleteProperty(propertyId, userId)
}

export async function createAttachmentPresignedUrl(propertyId: string): Promise<string>{
  return await attachmentAccess.createAttachmentPresignedUrl(propertyId)
}

export async function updatePropertyWithUrl(userId: string, propertyId: string, uploadUrl: string): Promise<string>{
  return await propertyAccess.updatePropertyWithUrl(userId, propertyId, uploadUrl)
}

