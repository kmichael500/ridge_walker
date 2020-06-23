import * as express from 'express';
import * as multer from 'multer';
import {MongooseDocument} from 'mongoose';
import {Parser} from 'json2csv';

import json2csv from 'json2csv';
import {Request, Response, NextFunction} from 'express';
import {Points, Feature} from '../models/MasterPointInterface';
import {LeadPoint, LeadPointInterface} from '../models/LeadPoint';

// Initialize an express api and configure it parse requests as JSON
const leadPointAPI = express();
leadPointAPI.use(express.json());

const storage = multer.memoryStorage();
var upload = multer({storage: storage});

var upload = multer({storage: storage});

// Endpoint to add all TCS points a submission by ID
leadPointAPI.post('/upload', upload.single('csv'), (req, res, next) => {
  const csv = require('csvtojson');
  csv()
    .fromString(req.file.buffer.toString())
    .then((jsonObj: any) => {
      let geojson = {} as Points;
      const GeoJSON = require('geojson');
      geojson = GeoJSON.parse(jsonObj, {Point: [req.body.lat, req.body.long]});
      let valid = true;
      for (const key in geojson.features) {
        if (geojson.features[key].geometry.coordinates === undefined) {
          valid = false;
          break;
        }
      }
      if (valid) {
        res.json(geojson);
      } else {
        res.status(422).send('Bad Coordinate Fields');
      }

      // for (let i = 0; i<geojson.features.length; i++){
      //     const newMasterPoint = new LeadPoint({
      //         type: geojson.features[i].type,
      //         properties: geojson.features[i].properties,
      //         geometry: geojson.features[i].geometry
      //     })
      //     newMasterPoint.save((err) => {
      //         if (err) {
      //             console.log("\n `err`");
      //             next(err)
      //         }
      //         else {
      //             console.log(geojson.features[i].properties.tcsnumber + ' saved successfully!');
      //         }
      //     });
      // }
    });
});

leadPointAPI.post('/', (req, res, next) => {
  const test = async () =>
    await new Promise(async (resolve, reject) => {
      const points = req.body as LeadPointInterface[];

      const promises = points.map(point => {
        const newSubmission = new LeadPoint({
          ...point,
        });

        newSubmission.save().catch((err: any) => {
          reject(err);
        });
      });

      Promise.all(promises)
        .then(results => {
          resolve('Successfully Uploaded');
        })
        .catch(error => {
          reject(error);
        });
    });
  test()
    .then(message => {
      res.status(201).send(message);
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
});

// get all master points
leadPointAPI.get('/', (req, res, next) => {
  LeadPoint.find((err: Error, requestedPoints: MongooseDocument) => {
    if (err) {
      console.log("\n Can't get master submissions");
      next(err);
    } else {
      res.send(requestedPoints);
    }
  }).lean();
});

// get a single master point by tcsnumber

// Endpoint to get a single submission by id
leadPointAPI.get('/:id', (req, res, next) => {
  LeadPoint.findById(req.params.id, (err, requestedPoint) => {
    res.json(requestedPoint);
  });
});

// get all master points as gpx
leadPointAPI.get('/download/gpx', (req, res, next) => {
  LeadPoint.find((err: Error, requestedPoints: MongooseDocument) => {
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

// get all master points as gpx
leadPointAPI.get('/download/csv', (req, res, next) => {
  LeadPoint.find((err: Error, requestedPoints: MongooseDocument) => {
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
leadPointAPI.get('*', (req, res, next) => {
  const err = new Error('Page Not Found');
  next(err);
});

//General server error handler
leadPointAPI.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    // res.statusMessage = err.message;
    res.status(500).send(err.message);
    console.error('ERROR MESSAGE');
    console.error(err.message);
  }
);

export {leadPointAPI};
