import * as express from 'express';
import * as multer from 'multer'
import { MongooseDocument } from 'mongoose'
var csv2geojson = require('csv2geojson');
import {Request, Response, NextFunction} from 'express';
import * as fs from "fs"
import { resolve } from 'dns';
import { Points } from '../models/MasterPoint'
import { MasterPoint } from '../models/MasterPoints';
import * as path from 'path'

import * as glob from 'glob'

// Initialize an express api and configure it parse requests as JSON
const mapsAPI = express();
mapsAPI.use(express.json());

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
// Download a map
mapsAPI.get("/:id", (req, res, next)=>{
    const searchString = req.params.id + '_*.pdf';
    glob(searchString, {cwd:"public/maps"}, function (err, files) {
 
        if (err) {
     
            console.log(err);
     
        } else {
            res.sendFile(files[0],{root: "./public/maps"})           
        }
     
    });
})

// // Download a map
// mapsAPI.get("/:id", (req, res, next)=>{
//     const searchString = req.params.id + '_*.pdf';
//     glob(searchString, {cwd:"public/maps"}, function (err, files) {
 
//         if (err) {
     
//             console.log(err);
     
//         } else {
     
//             var file = fs.createReadStream('./public/maps/' + files[0]);
//             var stat = fs.statSync('./public/maps/' + files[0]);
//             res.setHeader('Content-Length', stat.size);
//             res.setHeader('Content-Type', 'application/pdf');
//             const fileName = 'attachment; ' + files[0]
//             res.setHeader('Content-Disposition', fileName);
//             file.pipe(res);             
//         }
     
//     });
// })

//Catches every request to a route we have not defined elsewhere.
mapsAPI.get('*', (req, res, next) => {
    const err = new Error('Page Not Found');
    next(err);
});


//General server error handler
mapsAPI.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(500)
    console.error("ERROR MESSAGE")
    console.error(err.message);
    console.log();
})


export { mapsAPI };