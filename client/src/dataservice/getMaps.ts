import axios from 'axios';
import {serverBaseURL} from '../config/urlConfig';

const axiosInstance = axios.create({
  baseURL: serverBaseURL,
});

/**
 * Fetch all file paths for maps from the API.
 * @returns Promise<string[]>
 */
async function getMapFileNames(tcsNumber: string): Promise<string[]> {
  try {
    const response = await axiosInstance.get(
      'api/maps/' + tcsNumber + '/getAll',
      {params: {secret_token: localStorage.getItem('JWT')}}
    );
    for (let i = 0; i < response.data.length; i++) {
      response.data[i] = serverBaseURL + 'api/maps/' + response.data[i];
    }
    return response.data as string[];
  } catch (error) {
    return error;
  }
}

/**
 * Fetch all file paths for maps from the API.
 * @returns Promise<Feature[]>
 */
async function getImageFileNames(tcsNumber: string): Promise<string[]> {
  try {
    const response = await axiosInstance.get(
      'api/maps/' + tcsNumber + '/getAll',
      {params: {secret_token: localStorage.getItem('JWT')}}
    );
    for (let i = 0; i < response.data.length; i++) {
      // response.data[i] = serverBaseURL + 'api/maps/image/' + response.data[i];
      response.data[i] = response.data[i].replace('.pdf', '.png');
    }
    return response.data as string[];
  } catch (error) {
    return error;
  }
}

/**
 * Fetch all file paths for maps from the API.
 * @param filePath - filepath of image
 * @returns Promise<string>
 */
async function mapToBase64(filePath: string): Promise<string> {
  try {
    const response = await axiosInstance.get(
      serverBaseURL + 'api/maps/image/' + filePath,
      {
        responseType: 'arraybuffer',
        params: {secret_token: localStorage.getItem('JWT')},
      }
    );
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return base64;
  } catch (error) {
    return error;
  }
}

/**
 * Downloads a specific map.
 * @returns Promise<void>
 * @param fileName - name of map on server.
 */
async function downloadMap(fileName: string): Promise<void> {
  try {
    const downloadResponse = await axiosInstance.get('/api/maps/' + fileName, {
      responseType: 'blob',
      params: {secret_token: localStorage.getItem('JWT')},
    });
    const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
    console.log(downloadResponse.headers);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    return error;
  }
}

export {getMapFileNames, getImageFileNames, mapToBase64, downloadMap};
