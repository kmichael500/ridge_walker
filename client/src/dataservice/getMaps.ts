import axios, { AxiosResponse } from 'axios';
import { serverBaseURL } from '../config/urlConfig';
import { Feature } from '../pages/geoJsonInterface'

const axiosInstance = axios.create({
    baseURL: serverBaseURL
});

/**
 * Fetch all master points from the API.
 * @returns Promise<Feature[]>
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



export {
    getMapFileNames,
}
