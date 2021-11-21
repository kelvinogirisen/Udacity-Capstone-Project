import { apiEndpoint } from '../config'
import { Property } from '../types/Property';
import { CreatePropertyRequest } from '../types/CreatePropertyRequest';
import Axios from 'axios'
import { UpdatePropertyRequest } from '../types/UpdatePropertyRequest';

export async function getProperties(idToken: string): Promise<Property[]> {
  console.log('Fetching properties')

  const response = await Axios.get(`${apiEndpoint}/property`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Properties:', response.data)
  return response.data.items
}

export async function createProperty(
  idToken: string,
  newProperty: CreatePropertyRequest
): Promise<Property> {
  const response = await Axios.post(`${apiEndpoint}/property`,  JSON.stringify(newProperty), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,      
    }
  })
  return response.data.item
}

export async function createPropertyId(
  idToken: string,
  newProperty: CreatePropertyRequest
): Promise<Property> {
  const response = await Axios.post(`${apiEndpoint}/property`,  JSON.stringify(newProperty), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,      
    }
  })
  return response.data.item
}

export async function patchProperty(
  idToken: string,
  propertyId: string,
  updatedProperty: UpdatePropertyRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/property/${propertyId}`, JSON.stringify(updatedProperty), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,      
    }
  })
}

export async function deleteProperty(
  idToken: string,
  propertyId: string
): Promise<void> {
  const response = await Axios.delete(`${apiEndpoint}/property/${propertyId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`      
    }
  })
  return response.data.item
}

export async function getUploadUrl(
  idToken: string,
  propertyId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/property/${propertyId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
