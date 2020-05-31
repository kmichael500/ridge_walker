import { FeatureType, Geometry } from './geoJsonInterface'
import GeoJsonObject from 'react-leaflet-markercluster'


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

export interface LeadPoints extends GeoJsonObject {
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