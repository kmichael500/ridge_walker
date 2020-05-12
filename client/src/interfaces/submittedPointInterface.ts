import { Feature } from './geoJsonInterface'

export interface SubmittedPoint {
    point: Feature,
    submitted_by: string,
    date?: Date,
    status: StatusType,
    pointType: PointType,
    _id?: string
}

export enum StatusType {
    pending = "Pending",
    approved = "Approved",
    rejected = "Rejected"
}

export enum PointType {
    newCave = "New",
    existingCave = "Existing"
}