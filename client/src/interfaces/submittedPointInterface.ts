import { Feature } from './geoJsonInterface'

export interface SubmittedPoint {
    point: Feature,
    submitted_by: string,
    date?: Date,
    _id?: string
}