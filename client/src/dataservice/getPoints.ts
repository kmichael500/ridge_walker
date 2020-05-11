import axios, { AxiosResponse } from 'axios';
import { serverBaseURL } from '../config/urlConfig';
import { Feature } from '../interfaces/geoJsonInterface'

const axiosInstance = axios.create({
    baseURL: serverBaseURL
});

/**
 * Fetch all master points from the API.
 * @returns Promise<Feature[]>
 */
async function getAllMasterPoints(): Promise<Feature[]> {
    try {
        const getInterviewsResponse = await axiosInstance.get('/api/points/master');
        return getInterviewsResponse.data as Feature[];
    } catch(error) {
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
        const masterPointResponse = await axiosInstance.get('/api/points/master/'+tcsnumber);
        return masterPointResponse.data as Feature;
    } catch(error) {
        return error;
    } 
}

export {
    getAllMasterPoints,
    getMasterPoint,
}
