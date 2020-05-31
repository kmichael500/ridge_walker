import axios from 'axios';
import { serverBaseURL } from '../config/urlConfig';

const axiosInstance = axios.create({
    baseURL: serverBaseURL
});

/**
 * Fetch all file paths for maps from the API.
 * @returns Promise<string[]>
 */
async function getMapFileNames(tcsNumber: string): Promise<string[]> {
    try {
        const response = await axiosInstance.get('api/maps/'+tcsNumber+'/getAll');
        for (let i = 0; i<response.data.length; i++){
            response.data[i] = serverBaseURL + "api/maps/" + response.data[i]
        }
        return response.data as string[];
    } catch(error) {
        return error;
    } 
}

/**
 * Fetch all file paths for maps from the API.
 * @returns Promise<Feature[]>
 */
async function getImageFileNames(tcsNumber: string): Promise<string[]> {
    try {
        const response = await axiosInstance.get('api/maps/'+tcsNumber+'/getAll');
        for (let i = 0; i<response.data.length; i++){
            response.data[i] = serverBaseURL + "api/maps/image/" + response.data[i];
            response.data[i] = response.data[i].replace(".pdf", ".png")
        }
        return response.data as string[];
    } catch(error) {
        return error;
    } 
}



export {
    getMapFileNames,
    getImageFileNames
}
