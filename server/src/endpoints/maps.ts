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

import "pdf-image"

import * as glob from 'glob'
import { PDFImage } from 'pdf-image';

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
// // View map in browser
// mapsAPI.get("/:mapName", (req, res, next)=>{
//     try{
//         res.sendFile(req.params.mapName,{root: "./public/maps"})   
//     }
//     catch(error){
//         res.sendStatus(404);
//     }
// })

// Map as image
mapsAPI.get("/image/:mapName.png", (req, res, next)=>{
    try{
        var pdfPath = "./public/maps/"+req.params.mapName+".pdf";
        var pageNumber = 0;
        
        var pdfImage = new PDFImage(pdfPath, {
            convertOptions: {
                "-resize": "50%",
                // "-density": "200",
                "-background": "white",
                "-alpha": "background -alpha off",
              },
              outputDirectory: "./public/maps/images/",
            //   combinedImage: true
            
        });
        pdfImage.setConvertExtension("png")
    
        pdfImage.convertPage(0).then(function (imagePath) {
            console.log(imagePath)
            res.sendFile(imagePath, {root:"./"});
        }, function (err) {
        res.send(500);
    });

         
    }
    catch(error){
        res.sendStatus(404);
    }
})

// Get map file names
mapsAPI.get("/:id/getAll", (req, res, next)=>{
    const searchString = req.params.id + '_*.pdf';
    glob(searchString, {cwd:"public/maps"}, function (err, files) {
        console.log(files)
        if (err) {
     
            console.log(err);
     
        } else {
            try{
                res.json(files)   
            }
            catch(error){
                res.sendStatus(404);
            }
                    
        }
     
    });
})

// Download a map
mapsAPI.get("/:id", (req, res, next)=>{
        try{
            var file = fs.createReadStream('./public/maps/' + req.params.id);
            var stat = fs.statSync('./public/maps/' + req.params.id);
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'application/pdf');
            const fileName = 'attachment; ' + req.params.id
            res.setHeader('Content-Disposition', fileName);
            file.pipe(res); 
        }
        catch(error){
            console.log("File not found")
            console.log(req.params.id)
            res.sendStatus(404)
            next(error)
        }
    
        
})

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