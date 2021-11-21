/**
 * Fields in a request to update a single student.
 */
 export interface UpdatePropertyRequest {
    title: string
    description: string
    type: string
    location: string
    expireDate: string
    done: boolean
}
