import * as express from 'express';
import * as multer from 'multer';
import {MongooseDocument} from 'mongoose';
import {Parser} from 'json2csv';

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
      geojson = GeoJSON.parse(jsonObj, {Point: ['latitude', 'longitude']});

      for (let i = 0; i < geojson.features.length; i++) {
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

var mcache = require('memory-cache');

// cache based on duration and request url
var cache = (duration: any) => {
  return (req: any, res: any, next: any) => {
    let matched = /[^?]*/g.exec(req.originalUrl);
    let key = "";
    if (matched !== null){
      key = '_express_' + matched[0]
    }
    console.log("key", key)
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body: any) =>{
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      }
      next();
    }
  }
}

// get all master points
// cache is updated every 30 seconds
masterPointsAPI.get('/', cache(30), (req, res, next) => {
    MasterPoint.find((err: Error, requestedPoints: MongooseDocument) => {
      if (err) {
        console.log("\n Can't get master submissions");
        next(err);
      } else {
        res.send(requestedPoints);
      }
    }).lean();  
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
