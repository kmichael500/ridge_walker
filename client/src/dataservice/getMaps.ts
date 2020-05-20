import axios, { AxiosResponse } from 'axios';
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
        const getInterviewsResponse = await axiosInstance.get('api/maps/'+tcsNumber+'/getAll');
        for (let i = 0; i<getInterviewsResponse.data.length; i++){
            getInterviewsResponse.data[i] = serverBaseURL + "api/maps/" + getInterviewsResponse.data[i]
        }
        return getInterviewsResponse.data as string[];
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
        const getInterviewsResponse = await axiosInstance.get('api/maps/'+tcsNumber+'/getAll');
        for (let i = 0; i<getInterviewsResponse.data.length; i++){
            getInterviewsResponse.data[i] = serverBaseURL + "api/maps/image/" + getInterviewsResponse.data[i];
            getInterviewsResponse.data[i] = getInterviewsResponse.data[i].replace(".pdf", ".png")
        }
        return getInterviewsResponse.data as string[];
    } catch(error) {
        return error;
    } 
}



export {
    getMapFileNames,
    getImageFileNames
}
