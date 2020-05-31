import * as mongoose from 'mongoose';
import { FeatureType, Feature, Geometry, PropertyType, GeometryType } from './MasterPointInterface';

export interface LeadPointInterface {
    point: LeadFeature,
    createdAt?: Date,
    updatedAt?: Date,
    _id?: string
}

export enum LeadType {
    KARSTFEATURE = "Karst Feature",
}
export enum CheckedStatusType {
    CAVE = "Cave",
    NOTCAVE = "Not Cave",
    PENDING = "Not Checked"
}

// GeoJSON Stuff, fix properties for cave lead

export interface LeadPoints {
    type:     string;
    features: LeadFeature[];
}

export interface LeadFeature {
    type:       FeatureType;
    properties: LeadPropertyType;
    geometry:   Geometry;
}

export interface LeadPropertyType {
    submitted_by: string,
    lead_type: LeadType,
    checked_status: CheckedStatusType,
    description?: string,
}

const pointSchema = new mongoose.Schema({
    type: {
        type: FeatureType,
        required: true
    },
    properties: {
        type: {
            submitted_by: {
                type: String,
                required: true
            },
            lead_type: {
                type: "Karst Feature",
                required: true
            },
            checked_status: {
                type: CheckedStatusType,
                required: true
            },
            description: {
                type: String,
                default: ""
            }
        },
        required: true,
        
    },
    geometry:{
        type: {} as Geometry,
        required: true,
        
    },        
})

// Create Schema
const leadPointSchema = new mongoose.Schema({
    point:{
        type: pointSchema,
        required: true,
    }
},{timestamps:{updatedAt:"updatedAt", createdAt:"createdAt"}});

// tslint:disable-next-line:variable-name
const LeadPoint = mongoose.model('leadPoint', leadPointSchema);
export { LeadPoint }