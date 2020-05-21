import * as express from 'express';
import * as multer from 'multer'
import { MongooseDocument } from 'mongoose'
var csv2geojson = require('csv2geojson');

import {Request, Response, NextFunction} from 'express';
import { Points, Feature, Geometry } from '../models/MasterPoint'
import { MasterPoint } from '../models/MasterPoints';

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

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

var upload = multer({ storage:storage })


// Endpoint to add all TCS points a submission by ID
masterPointsAPI.post("/upload", upload.single("csv"), (req, res, next) => {
    
    let geojson = {} as Points
    csv2geojson.csv2geojson(req.file.buffer.toString(), (err:any, data:any)=>{
        geojson = data;
    });
    
    for (let i = 0; i<geojson.features.length; i++){
        const newMasterPoint = new MasterPoint({
            type: geojson.features[i].type,
            properties: geojson.features[i].properties,
            geometry: geojson.features[i].geometry
        })
        newMasterPoint.save((err) => {
            if (err) {
                console.log("\n `err`");
                next(err)
            }
            else {
                console.log(geojson.features[i]. properties.tcsnumber + ' saved successfully!');
            }
        });
    }
    res.send(geojson)
});

// get all master points
masterPointsAPI.get("/", (req, res, next)=>{
    MasterPoint.find((err: Error, requestedPoints: MongooseDocument) => {
        if (err) {
            console.log("\n Can't get master submissions");
            next(err)
        }
        else {
            res.json(requestedPoints)
        }
    }).lean();

})

// get a single master point by tcsnumber

// Endpoint to get a single submission by id
masterPointsAPI.get('/:id', (req, res, next) => {
    MasterPoint.find({'properties.tcsnumber':req.params.id}, (err, requestedPoint)=>{
        res.json(requestedPoint[0]);
    })

});


// get all master points as gpx
masterPointsAPI.get("/download/gpx", (req, res, next)=>{
    MasterPoint.find((err: Error, requestedPoints: MongooseDocument) => {
        if (err) {
            console.log("\n Can't get master submissions");
            next(err)
        }
        else {
        }
    }).lean().then((points)=>{
        var togpx = require('togpx');
        let geojson = { type:"FeatureCollection", features:(points) as unknown as Feature[]} as Points;

        let options = {
            creator: "TCS",
            featureDescription: (val: any)=>{
                let desc = ""
                desc += "\nLength: " + val.length;
                desc += "\nVertical Extent: " + val.depth;
                desc += "\nPit Depth: " + val.pdep;
                desc += "\nPits: " + val.ps;
                desc += "\nCounty: " + val.co_name;
                desc += "\nTopo: " + val.topo_name;
                desc += "\nTopo Indication: " + val.topo_indi;
                desc += "\nElevation: " + val.elev;
                desc += "\nOwnership: " + val.ownership;
                desc += "\nEquipment: " + val.gear;
                desc += "\nEntry: " + val.ent_type;
                desc += "\nField Indication: " + val.field_indi;
                desc += "\nMap Status: " + val.map_status;
                desc += "\nGeology: " + val.geology;
                desc += "\nGeology Age: " + val.geo_age;
                desc += "\nPhys Prov: " + val.phys_prov;
                desc += "\n\n" + val.narr.replace(/[^\x00-\x7F]/g, "");
                return(desc)
            },
            featureTitle: (val: any) => {
                return (val.tcsnumber + " " + val.name)
            }
        }
        let gpx = togpx(geojson, options)
        res.attachment('tcs' + new Date().getFullYear() + ".gpx")
        res.type('gpx')
        res.send(gpx)
    });


})

// get all master points as gpx
masterPointsAPI.get("/download/csv", (req, res, next)=>{
    MasterPoint.find((err: Error, requestedPoints: MongooseDocument) => {
        if (err) {
            console.log("\n Can't get master points");
            next(err)
        }
        else {
        }
    }).lean().then((response)=>{
        let points = (response) as unknown as Feature[];
        let geojson = { type:"FeatureCollection", features:points} as Points;
        const { Parser } = require('json2csv');
 
        const fields = [
            {
                label: 'tcsnumber', // Optional, column will be labeled 'path.to.something' if not defined)
                value: 'properties.tcsnumber', // data.path.to.something
                default: '' // default if value is not found (Optional, overrides `defaultValue` for column)
            },
            {
                label: 'name', // Optional, column will be labeled 'path.to.something' if not defined)
                value: 'properties.name', // data.path.to.something
                default: '' // default if value is not found (Optional, overrides `defaultValue` for column)
            },
            {
                label: 'latitude', // Optional, column will be labeled 'path.to.something' if not defined)
                value: 'geometry.coordinates[0]', // data.path.to.something
                default: '' // default if value is not found (Optional, overrides `defaultValue` for column)
            },
            {
                label: 'longitude', // Optional, column will be labeled 'path.to.something' if not defined)
                value: 'geometry.coordinates[1]', // data.path.to.something
                default: '' // default if value is not found (Optional, overrides `defaultValue` for column)
            },
        ]
        const opts = { fields };
        
        try {
            const parser = new Parser(opts);
            const csv = parser.parse(points);
            console.log(csv);
            res.send(csv);
        } catch (err) {
            console.error(err);
        }

        let options = {
            creator: "TCS",
            featureDescription: (val: any)=>{
                let desc = ""
                desc += "\nLength: " + val.length;
                desc += "\nVertical Extent: " + val.depth;
                desc += "\nPit Depth: " + val.pdep;
                desc += "\nPits: " + val.ps;
                desc += "\nCounty: " + val.co_name;
                desc += "\nTopo: " + val.topo_name;
                desc += "\nTopo Indication: " + val.topo_indi;
                desc += "\nElevation: " + val.elev;
                desc += "\nOwnership: " + val.ownership;
                desc += "\nEquipment: " + val.gear;
                desc += "\nEntry: " + val.ent_type;
                desc += "\nField Indication: " + val.field_indi;
                desc += "\nMap Status: " + val.map_status;
                desc += "\nGeology: " + val.geology;
                desc += "\nGeology Age: " + val.geo_age;
                desc += "\nPhys Prov: " + val.phys_prov;
                desc += "\n\n" + val.narr.replace(/[^\x00-\x7F]/g, "");
                return(desc)
            },
            featureTitle: (val: any) => {
                return (val.tcsnumber + " " + val.name)
            }
        }
        let gpx = togpx(geojson, options)
        res.attachment('tcs' + new Date().getFullYear() + ".gpx")
        res.type('gpx')
        res.send(gpx)
    });


})


//Catches every request to a route we have not defined elsewhere.
masterPointsAPI.get('*', (req, res, next) => {
    const err = new Error('Page Not Found');
    next(err);
});


//General server error handler
masterPointsAPI.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(500)
    console.error("ERROR MESSAGE")
    console.error(err.message);
    console.log();
})


export { masterPointsAPI };