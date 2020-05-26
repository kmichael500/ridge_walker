import * as mongoose from 'mongoose';
import { FeatureType, Feature, Geometry, PropertyType, GeometryType } from './MasterPoint';

// Create Schema
const leadPointSchema = new mongoose.Schema({
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
                type: String,
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
},{timestamps:{updatedAt:"updatedAt", createdAt:"createdAt"}});

// tslint:disable-next-line:variable-name
const LeadPoint = mongoose.model('leadPoint', leadPointSchema);
export { LeadPoint }