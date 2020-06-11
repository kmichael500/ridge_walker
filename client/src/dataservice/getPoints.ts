// API for master TCS Points

import axios from 'axios';
import {serverBaseURL} from '../config/urlConfig';
import {Feature} from '../interfaces/geoJsonInterface';

const axiosInstance = axios.create({
  baseURL: serverBaseURL,
});

// gets the secret token for API
const params = {
  secret_token: localStorage.getItem('JWT'),
};

/**
 * Fetch all master points from the API.
 * @returns Promise<Feature[]>
 */
async function getAllMasterPoints(): Promise<Feature[]> {
  try {
    const masterPointResponse = await axiosInstance.get('/api/points/master', {
      params,
    });
    return masterPointResponse.data as Feature[];
  } catch (error) {
    return error;
  }
}

/**
 * Fetch single master point from the API.
 * @returns Promise<Feature>
 * @param tcsnumber - the tcs number of a point.
 */
async function getMasterPoint(tcsnumber: string): Promise<Feature> {
  try {
    const masterPointResponse = await axiosInstance.get(
      '/api/points/master/' + tcsnumber,
      {params}
    );
    return masterPointResponse.data as Feature;
  } catch (error) {
    return error;
  }
}

/**
 * Downloads master points as csv or gpx.
 * @returns Promise<void>
 * @param fileType - 'csv' or 'gpx'.
 */
async function downloadMasterPoints(fileType: 'csv' | 'gpx'): Promise<void> {
  try {
    const downloadResponse = await axiosInstance.get(
      '/api/points/master/download/' + fileType,
      {
        responseType: 'blob',
        params,
      }
    );
    const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      'TCSDATA' + new Date().getFullYear() + '.' + fileType
    ); //or any other extension
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    return error;
  }
}

export {getAllMasterPoints, getMasterPoint, downloadMasterPoints};
