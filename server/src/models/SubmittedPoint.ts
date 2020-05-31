import * as mongoose from 'mongoose';
import {MasterPoint} from './MasterPoints'
import { Feature } from './MasterPointInterface';

// Create Schema
const submittedPointSchema = new mongoose.Schema<Feature>({
    point: {
        type: MasterPoint.schema,
        required: true
    },
    submitted_by:{
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ""
    },
    pointType: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
});

// tslint:disable-next-line:variable-name
const SubmittedPoint = mongoose.model('submittedPoint', submittedPointSchema);
export { SubmittedPoint }