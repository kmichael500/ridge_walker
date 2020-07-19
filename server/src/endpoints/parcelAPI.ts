import * as express from 'express';
import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';

import {Request, Response, NextFunction} from 'express';

// Initialize an express api and configure it parse requests as JSON
const parcelAPI = express();
parcelAPI.use(express.json());
const axiosInstance = axios.create();

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Endpoint to get a single submission by tcsnumber
parcelAPI.get('/:coords', async (req, res, next) => {
  console.log("Getting Parcel Data...");
  let parcelDataURL = '';
  console.log(req.params.coords);
  try {
    const lookupData = await axiosInstance.get(
      'https://landgrid.com/search.json?query=' + req.params.coords
    );
    const path = lookupData.data[0].path.split('/');
    const county = path[3];
    const city = path[4];
    const parcel = path[5];
    parcelDataURL =
      'https://landgrid.com/us/tn/' +
      county +
      '/' +
      city +
      '/' +
      parcel +
      '.json';
  } catch (error) {
    // console.log(error);
    res.send(error);
  }
  try {
    const config = {
      method: 'get',
      url: parcelDataURL,
      headers: {
        Cookie: '_session_id=59a2755481fc950fe966745134078b26',
      },
    } as AxiosRequestConfig;
    const parcelData = await axios(config);
    res.send(parcelData.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

//Catches every request to a route we have not defined elsewhere.
parcelAPI.get('*', (req, res, next) => {
  const err = new Error('Page Not Found');
  next(err);
});

//General server error handler
parcelAPI.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(500);
  console.error('ERROR MESSAGE');
  console.error(err.message);
  console.log();
});

export {parcelAPI};
