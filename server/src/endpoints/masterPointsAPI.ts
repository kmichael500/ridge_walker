import * as express from 'express';
import * as multer from 'multer'
var csv2geojson = require('csv2geojson');
import {Request, Response, NextFunction} from 'express';
import { resolve } from 'dns';

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


// Endpoint to update a submission by ID
masterPointsAPI.post("/upload", upload.single("csv"), (req, res, next) => {
    
    let geojson;
    // console.log(req.file.buffer);
    csv2geojson.csv2geojson(req.file.buffer.toString(), (err:any, data:any)=>{
        geojson = data;
    });
    
    console.log(geojson)
    res.send(geojson)
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