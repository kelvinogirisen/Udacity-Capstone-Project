export interface Property {
    userId: string
    propertyId: string
    createdAt: string
    title: string
    description: string
    type: string
    location: string
    expireDate: string
    done: boolean
    attachmentUrl?: string
  }