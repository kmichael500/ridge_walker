import * as express from 'express';
import * as multer from 'multer';
import {MongooseDocument, PaginateOptions} from 'mongoose';

import {Parser} from 'json2csv';
import {
  SearchParams,
  MasterPointPaginationReq,
} from '../interfaces/masterPointPagination';

import json2csv from 'json2csv';
import {Request, Response, NextFunction} from 'express';
import {Points, Feature, Geometry} from '../models/MasterPointInterface';
import {MasterPoint} from '../models/MasterPoints';

// Initialize an express api and configure it parse requests as JSON
const masterPointsAPI = express();
masterPointsAPI.use(express.json());

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public')
//     },
//     filename: function (req, file, cb) {
//         // You could rename the file name
//         // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))

//         // You could use the original name
//         cb(null, file.originalname)

//     }
// });

const storage = multer.memoryStorage();
var upload = multer({storage: storage});

var upload = multer({storage: storage});

// Endpoint to add all TCS points a submission by ID
masterPointsAPI.post('/upload', upload.single('csv'), (req, res, next) => {
  const csv = require('csvtojson');
  csv()
    .fromString(req.file.buffer.toString())
    .then((jsonObj: any) => {
      let geojson = {} as Points;
      console.log(jsonObj[0]);
      const GeoJSON = require('geojson');
      geojson = GeoJSON.parse(jsonObj, {
        Point: ['latitude', 'longitude'],
      }) as Points;

      for (let i = 0; i < geojson.features.length; i++) {
        geojson.features[i].properties.length = Number(
          geojson.features[i].properties.length
        );
        geojson.features[i].properties.depth = Number(
          geojson.features[i].properties.depth
        );
        geojson.features[i].properties.pdep = Number(
          geojson.features[i].properties.pdep
        );
        geojson.features[i].properties.ps = Number(
          geojson.features[i].properties.ps
        );
        geojson.features[i].properties.elev = Number(
          geojson.features[i].properties.elev
        );

        const newMasterPoint = new MasterPoint({
          type: geojson.features[i].type,
          properties: geojson.features[i].properties,
          geometry: geojson.features[i].geometry,
        });
        newMasterPoint.save(err => {
          if (err) {
            console.log('\n `err`');
            next(err);
          } else {
            console.log(
              geojson.features[i].properties.tcsnumber + ' saved successfully!'
            );
          }
        });
      }
      res.send(geojson);
    });
});

// cache based on duration and request url
const noPending = (userType: string) => {
  return (req: any, res: any, next: any) => {
    const userStatus = req.user.status;

    // req.user;
    if (userStatus != 'Approved') {
      res.send(req.user);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body: any) => {
        res.sendResponse(body);
      };
      next();
    }
  };
};

// master points paginate
masterPointsAPI.post('/', (req, res, next) => {
  const {
    searchParams,
    sortOrder,
    page,
    limit,
    pagination,
    sortBy,
  } = req.body as MasterPointPaginationReq;

  interface comparisonI {
    cmp: '<=' | '<';
    L: number | null;
    R: number | null;
  }

  type lefKeysI = 'lengthL' | 'pdepL' | 'depthL' | 'elevL' | 'psL';
  type rightKeysI = 'lengthR' | 'pdepR' | 'depthR' | 'elevR' | 'psR';
  type cmpKeysI = 'lengthCmp' | 'pdepCmp' | 'depthCmp' | 'elevCmp' | 'psCmp';

  const cmpIndex = ['length', 'pdep', 'depth', 'elev', 'ps'];
  const cmpKeys = [
    'lengthCmp',
    'pdepCmp',
    'depthCmp',
    'elevCmp',
    'psCmp',
  ] as cmpKeysI[];
  const lefKeys = ['lengthL', 'pdepL', 'depthL', 'elevL', 'psL'] as lefKeysI[];
  const rightKeys = [
    'lengthR',
    'pdepR',
    'depthR',
    'elevR',
    'psR',
  ] as rightKeysI[];

  const comparison = {
    cmp: '<=',
    L: null,
    R: null,
  } as comparisonI;
  const cmpValues = {} as any;
  for (const key in cmpKeys) {
    comparison.cmp = searchParams[cmpKeys[key]];
    comparison.L = searchParams[lefKeys[key]];
    comparison.R = searchParams[rightKeys[key]];

    switch (comparison.cmp) {
      case '<=':
        if (comparison.L !== null && comparison.R != null) {
          cmpValues['properties.' + cmpIndex[key]] = {
            $lte: comparison.R,
            $gte: comparison.L,
          };
        } else if (comparison.L !== null && comparison.R === null) {
          cmpValues['properties.' + cmpIndex[key]] = {
            $gte: comparison.L,
          };
        } else if (comparison.R !== null && comparison.L === null) {
          cmpValues['properties.' + cmpIndex[key]] = {
            $lte: comparison.R,
          };
        }
        break;
      case '<':
        if (comparison.L !== null && comparison.R != null) {
          cmpValues['properties.' + cmpIndex[key]] = {
            $lt: comparison.R,
            $gt: comparison.L,
          };
        } else if (comparison.L !== null && comparison.R === null) {
          cmpValues['properties.' + cmpIndex[key]] = {
            $gt: comparison.L,
          };
        } else if (comparison.R !== null && comparison.L === null) {
          cmpValues['properties.' + cmpIndex[key]] = {
            $lt: comparison.R,
          };
        }
        break;
    }
  }

  // regex search
  const name = new RegExp(searchParams.name);
  const tcsnumber = new RegExp(searchParams.tcsnumber);
  const co_name = new RegExp(
    searchParams.co_name.map(val => '^' + val + '$').join('|')
  );
  const ownership = new RegExp(
    searchParams.ownership.map(val => '^' + val + '$').join('|')
  );
  const topo_name = new RegExp(searchParams.topo_name);
  const topo_indi = new RegExp(
    searchParams.topo_indi.map(val => '^' + val + '$').join('|')
  );
  const gear = new RegExp(
    searchParams.gear.map(val => '^' + val + '$').join('|')
  );
  const ent_type = new RegExp(
    searchParams.ent_type.map(val => '^' + val + '$').join('|')
  );
  const field_indi = new RegExp(
    searchParams.field_indi.map(val => '^' + val + '$').join('|')
  );
  const map_status = new RegExp(
    searchParams.map_status.map(val => '^' + val + '$').join('|')
  );
  const geology = new RegExp(searchParams.geology);
  const geo_age = new RegExp(searchParams.geo_age);
  const phys_prov = new RegExp(searchParams.phys_prov);

  const query = {
    'properties.name': {$regex: name, $options: 'i'},
    'properties.tcsnumber': {$regex: tcsnumber, $options: 'i'},
    'properties.co_name': {$regex: co_name, $options: 'i'},
    'properties.ownership': {$regex: ownership, $options: 'i'},
    'properties.topo_name': {$regex: topo_name, $options: 'i'},
    'properties.topo_indi': {$regex: topo_indi, $options: 'i'},
    'properties.gear': {$regex: gear, $options: 'i'},
    'properties.ent_type': {$regex: ent_type, $options: 'i'},
    'properties.field_indi': {$regex: field_indi, $options: 'i'},
    'properties.map_status': {$regex: map_status, $options: 'i'},
    'properties.geology': {$regex: geology, $options: 'i'},
    'properties.geo_age': {$regex: geo_age, $options: 'i'},
    'properties.phys_prov': {$regex: phys_prov, $options: 'i'},
    ...cmpValues,
  };

  const options = {
    pagination,
    page,
    limit,
    lean: true,
    collation: {
      locale: 'en',
    },
    sort: {
      ['properties.' + sortBy]: sortOrder,
    },
  } as PaginateOptions;

  MasterPoint.paginate(query, options, (err, requestedPoints) => {
    if (err) {
      console.log("\n Can't get master submissions");
      next(err);
    } else {
      requestedPoints.docs = requestedPoints.docs.map(point => {
        point.properties.narr = '';
        return point;
      });
      res.send(requestedPoints);
    }
  });
});

// Endpoint to get a single submission by tcsnumber
masterPointsAPI.get('/:id', (req, res, next) => {
  MasterPoint.find(
    {'properties.tcsnumber': req.params.id},
    (err, requestedPoint) => {
      res.json(requestedPoint[0]);
    }
  );
});

// get all master points as gpx
masterPointsAPI.get('/download/gpx', (req, res, next) => {
  MasterPoint.find((err: Error, requestedPoints: MongooseDocument) => {
    if (err) {
      console.log("\n Can't get master submissions");
      next(err);
    } else {
    }
  })
    .lean()
    .then(points => {
      const togpx = require('togpx');
      const geojson = {
        type: 'FeatureCollection',
        features: (points as unknown) as Feature[],
      } as Points;

      const options = {
        creator: 'TCS',
        featureDescription: (val: any) => {
          let desc = '';
          desc += '\nLength: ' + val.length;
          desc += '\nVertical Extent: ' + val.depth;
          desc += '\nPit Depth: ' + val.pdep;
          desc += '\nPits: ' + val.ps;
          desc += '\nCounty: ' + val.co_name;
          desc += '\nTopo: ' + val.topo_name;
          desc += '\nTopo Indication: ' + val.topo_indi;
          desc += '\nElevation: ' + val.elev;
          desc += '\nOwnership: ' + val.ownership;
          desc += '\nEquipment: ' + val.gear;
          desc += '\nEntry: ' + val.ent_type;
          desc += '\nField Indication: ' + val.field_indi;
          desc += '\nMap Status: ' + val.map_status;
          desc += '\nGeology: ' + val.geology;
          desc += '\nGeology Age: ' + val.geo_age;
          desc += '\nPhys Prov: ' + val.phys_prov;
          desc += '\n\n' + val.narr.replace(/[^\x00-\x7F]/g, '');
          return desc;
        },
        featureTitle: (val: any) => {
          return val.tcsnumber + ' ' + val.name;
        },
      };
      const gpx = togpx(geojson, options);
      res.attachment('TCSDATA' + new Date().getFullYear() + '.gpx');
      res.type('gpx');
      res.send(gpx);
    });
});

// get all master points as csv
masterPointsAPI.get('/download/csv', (req, res, next) => {
  MasterPoint.find((err: Error, requestedPoints: MongooseDocument) => {
    if (err) {
      console.log("\n Can't get master points");
      next(err);
    } else {
    }
  })
    .lean()
    .then(response => {
      const points = (response as unknown) as Feature[];
      const geojson = {type: 'FeatureCollection', features: points} as Points;

      const fields = [
        {
          label: 'tcsnumber', // Optional, column will be labeled 'path.to.something' if not defined)
          value: 'properties.tcsnumber', // data.path.to.something
          default: '', // default if value is not found (Optional, overrides `defaultValue` for column)
        },
        {
          label: 'name', // Optional, column will be labeled 'path.to.something' if not defined)
          value: 'properties.name', // data.path.to.something
          default: '', // default if value is not found (Optional, overrides `defaultValue` for column)
        },
        {
          label: 'latitude', // Optional, column will be labeled 'path.to.something' if not defined)
          value: 'geometry.coordinates[1]', // data.path.to.something
          default: '', // default if value is not found (Optional, overrides `defaultValue` for column)
        },
        {
          label: 'longitude', // Optional, column will be labeled 'path.to.something' if not defined)
          value: 'geometry.coordinates[0]', // data.path.to.something
          default: '', // default if value is not found (Optional, overrides `defaultValue` for column)
        },
        {
          label: 'length', // Optional, column will be labeled 'path.to.something' if not defined)
          value: 'properties.length', // data.path.to.something
          default: '', // default if value is not found (Optional, overrides `defaultValue` for column)
        },
        {
          label: 'depth',
          value: 'properties.depth',
          default: '',
        },
        {
          label: 'pdep',
          value: 'properties.pdep',
          default: '',
        },
        {
          label: 'ps',
          value: 'properties.ps',
          default: '',
        },
        {
          label: 'co_name',
          value: 'properties.co_name',
          default: '',
        },
        {
          label: 'topo_name',
          value: 'properties.topo_name',
          default: '',
        },
        {
          label: 'topo_indi',
          value: 'properties.topo_indi',
          default: '',
        },
        {
          label: 'elev',
          value: 'properties.elev',
          default: '',
        },
        {
          label: 'ownership',
          value: 'properties.ownership',
          default: '',
        },
        {
          label: 'gear',
          value: 'properties.gear',
          default: '',
        },
        {
          label: 'ent_type',
          value: 'properties.ent_type',
          default: '',
        },
        {
          label: 'field_inid',
          value: 'properties.field_indi',
          default: '',
        },
        {
          label: 'map_status',
          value: 'properties.map_status',
          default: '',
        },
        {
          label: 'geology',
          value: 'properties.geology',
          default: '',
        },
        {
          label: 'geo_age',
          value: 'properties.geo_age',
          default: '',
        },
        {
          label: 'phys_prov',
          value: 'properties.phys_prov',
          default: '',
        },
        {
          label: 'narr',
          value: 'properties.narr',
          default: '',
        },
      ];
      const opts = {fields, withBOM: true} as json2csv.Options<any>;

      try {
        const parser = new Parser(opts);
        const csv = parser.parse(points);
        res.attachment('TCSDATA' + new Date().getFullYear() + '.csv');
        res.type('csv');
        res.send(csv);
      } catch (err) {
        console.log('\nError converting to csv');
        next(err);
      }
    });
});

//Catches every request to a route we have not defined elsewhere.
masterPointsAPI.get('*', (req, res, next) => {
  const err = new Error('Page Not Found');
  next(err);
});

//General server error handler
masterPointsAPI.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(500);
    console.error('ERROR MESSAGE');
    console.error(err.message);
    console.log();
  }
);

export {masterPointsAPI};
