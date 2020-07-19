import {PaginateModel, Document, Schema, model} from 'mongoose';

import {
  FeatureType,
  Feature,
  Geometry,
  PropertyType,
  GeometryType,
} from './MasterPointInterface';
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const masterPointSchema = new Schema({
  type: {
    type: FeatureType,
    required: true,
  },
  properties: {
    type: {
      tcsnumber: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      length: {
        type: Number,
        required: true,
      },
      depth: {
        type: Number,
        required: true,
      },
      pdep: {
        type: Number,
        required: true,
      },
      ps: {
        type: Number,
        required: true,
      },
      co_name: {
        type: String,
        required: true,
      },
      topo_name: {
        type: String,
        required: true,
      },
      topo_indi: {
        type: String,
        required: true,
      },
      elev: {
        type: Number,
        required: true,
      },
      ownership: {
        type: String,
        required: true,
      },
      gear: {
        type: String,
        required: true,
      },
      ent_type: {
        type: Number,
        required: true,
      },
      field_indi: {
        type: String,
        required: true,
      },
      map_status: {
        type: String,
        required: true,
      },
      geology: {
        type: Number,
        required: true,
      },
      geo_age: {
        type: String,
        required: true,
      },
      phys_prov: {
        type: String,
        required: true,
      },
      narr: {
        type: Number,
        required: true, // TODO
      },
    },
    required: true,
  },
  geometry: {
    type: {} as Geometry,
    required: true,
  },
});

masterPointSchema.index({'properties.narr': 'text'});

masterPointSchema.plugin(mongoosePaginate);

type MasterPoint<T extends Document> = PaginateModel<T>;
export const MasterPoint: MasterPoint<Feature> = model<Feature>(
  'masterPoint',
  masterPointSchema
) as MasterPoint<Feature>;

// tslint:disable-next-line:variable-name
// const MasterPoint = mongoose.model<Feature>('masterPoint', masterPointSchema);
// export {MasterPoint};
