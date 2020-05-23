import * as express from 'express';
import * as multer from 'multer'
import { MongooseDocument } from 'mongoose'
import { Parser, transforms } from 'json2csv';

import {cave_center} from './cave_center'


import json2csv from 'json2csv'
import {Request, Response, NextFunction} from 'express';
import { Points, Feature, Geometry } from '../models/MasterPoint'
import { MasterPoint } from '../models/MasterPoints';
import { TextEncoder } from 'util';

// Initialize an express api and configure it parse requests as JSON
const statisticsAPI = express();
statisticsAPI.use(express.json());


// get all master points
statisticsAPI.get("/", (req, res, next)=>{
    const getStats = async function() {
        const mapped =  await MasterPoint.countDocuments({'properties.map_status':"Mapped"});
        // const notGrade5 =  await MasterPoint.countDocuments({'properties.map_status':{"$ne":/^(Mapped|Unmapped|$^)$/g}});
        const sketch =  await MasterPoint.countDocuments({'properties.map_status':"Sketch"});
        const paceCompass = await MasterPoint.countDocuments({'properties.map_status':/^Pace & Compass$/g});
        const tapeCompass = await MasterPoint.countDocuments({'properties.map_status':/^Tape & Compass$/g});
        const unmapped = await MasterPoint.countDocuments({'properties.map_status':"Unmapped"});

        const mapStats = [
            {name: "Mapped", value: mapped},
            {name: "Unmaped", value: unmapped},
            {name: "Sketch", value: sketch},
            {name: "Pace & Compass", value: paceCompass},
            {name: "Tape & Compass", value: tapeCompass},
            {name: "Not Grade 5", value: paceCompass+tapeCompass+sketch},
        ]

        let sortedCaves = await MasterPoint.find().lean() as Feature[];
        sortedCaves = sortedCaves.sort((a,b)=> b.properties.length - a.properties.length);

        const longestByCounty = {} as any;
        for (const key in sortedCaves){
            if (!/^\D+\d+$/g.test(sortedCaves[key].properties.tcsnumber)){
                continue;
            }
            if (longestByCounty[sortedCaves[key].properties.co_name] === undefined){
                longestByCounty[sortedCaves[key].properties.co_name] = {
                    tenLongest: [sortedCaves[key].properties.length],
                    totalCaves: 1
                }
            }
            else if (longestByCounty[sortedCaves[key].properties.co_name].tenLongest.length < 10){
                longestByCounty[sortedCaves[key].properties.co_name].tenLongest.push(sortedCaves[key].properties.length);
                longestByCounty[sortedCaves[key].properties.co_name].totalCaves++;
            }
            else{
                longestByCounty[sortedCaves[key].properties.co_name].totalCaves++;
            }
        }

        const totalPoints = await MasterPoint.countDocuments({});
        const extraEnteranceTotal = await MasterPoint.countDocuments({'properties.tcsnumber':/^\D+\w+E\d+$/g});
        const totalCaves = await MasterPoint.countDocuments({'properties.tcsnumber':/^\D+\d+$/g});
        res.json({
            mapStats,
            totalPoints,
            totalCaves,
            extraEnteranceTotal,
            allLengths: longestByCounty
            // tenLongestCaves
        })
    }
    getStats();
    


})

statisticsAPI.get("/county", (req, res, next)=>{
    
    var GeoJSON = require('geojson');
    
    var geojson = GeoJSON.parse(cave_center, {Point: ['longitude', 'latitude']});

    console.log(cave_center[0])
    
    res.send(geojson);


})



//Catches every request to a route we have not defined elsewhere.
statisticsAPI.get('*', (req, res, next) => {
    const err = new Error('Page Not Found');
    next(err);
});


//General server error handler
statisticsAPI.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(500)
    console.error("ERROR MESSAGE")
    console.error(err.message);
    console.log();
})


export { statisticsAPI };