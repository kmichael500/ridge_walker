import * as express from 'express';
import * as multer from 'multer'
import { MongooseDocument } from 'mongoose'
var csv2geojson = require('csv2geojson');
import {Request, Response, NextFunction} from 'express';
import { resolve } from 'dns';
import { Points } from '../models/MasterPoint'
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