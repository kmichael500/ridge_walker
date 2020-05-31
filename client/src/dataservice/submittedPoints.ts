import axios, { AxiosResponse } from 'axios';
import { serverBaseURL } from '../config/urlConfig';
import { SubmittedPoint } from '../interfaces/submittedPointInterface'

const axiosInstance = axios.create({
    baseURL: serverBaseURL
});

/**
 * Fetch all submitted points from the API.
 * @returns Promise<SubmittedPoint[]>
 */
async function getAllSubmittedPoints(): Promise<SubmittedPoint[]> {
    try {
        const getInterviewsResponse = await axiosInstance.get('/api/submit/point');
        return getInterviewsResponse.data as SubmittedPoint[];
    } catch(error) {
        return error;
    } 
}

/**
 * Fetch single submitted point from the API.
 * @returns Promise<SubmittedPoint>
 * @param id - the mongo id of a point.
 */
async function getSubmittedPoint(id: string): Promise<SubmittedPoint> {
    try {
        console.log(id);
        const submittedPointResponse = await axiosInstance.get('/api/submit/point/'+id);
        console.log(submittedPointResponse.data)
        return submittedPointResponse.data as SubmittedPoint;
    } catch(error) {
        return error;
    } 
}


/**
 * Fetch single master point from the API.
 * @returns Promise<SubmittedPoint>
 * @param point - the point for review.
 */
async function addSubmittedPoint(point: SubmittedPoint): Promise<AxiosResponse> {
    try {
        const masterPointResponse = await axiosInstance.post('/api/submit/point/', point);
        console.log("Submitted", masterPointResponse)
        return masterPointResponse;
    } catch(error) {
        
        return error;
    } 
}

/**
 * Delete a single submitted point by id
 * @returns void
 * @param id - the id of the point for deletion.
 */
async function deleteOneSubmittedPointByID(id: string): Promise<AxiosResponse> {
    try {
        const masterPointResponse = await axiosInstance.delete('/api/submit/point/' + id);
        return masterPointResponse;
    } catch(error) {
        
        return error;
    } 
}

/**
 * Delete a single submitted point by id
 * @returns void
 * @param id - the id of the point for deletion.
 */
async function updateOneSubmittedPointByID(id: string, point: SubmittedPoint): Promise<AxiosResponse> {
    try {
        const masterPointResponse = await axiosInstance.put('/api/submit/point/' + id, point);
        return masterPointResponse;
    } catch(error) {
        
        return error;
    } 
}

export {
    getAllSubmittedPoints,
    getSubmittedPoint,
    addSubmittedPoint,
    deleteOneSubmittedPointByID,
    updateOneSubmittedPointByID
}
