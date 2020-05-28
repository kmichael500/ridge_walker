import axios, { AxiosResponse } from 'axios';
import { serverBaseURL } from '../config/urlConfig';
import { SubmittedPoint } from '../interfaces/submittedPointInterface'
import { LeadPoints, LeadPointInterface } from '../interfaces/LeadPointInterface';

const axiosInstance = axios.create({
    baseURL: serverBaseURL
});

/**
 * Fetch all submitted points from the API.
 * @returns Promise<SubmittedPoint[]>
 */
async function getAllLeadPoints(): Promise<LeadPointInterface[]> {
    try {
        const getInterviewsResponse = await axiosInstance.get('/api/points/leads');
        return getInterviewsResponse.data as LeadPointInterface[];
    } catch(error) {
        return error;
    } 
}

/**
 * Fetch single submitted point from the API.
 * @returns Promise<SubmittedPoint>
 * @param id - the mongo id of a point.
 */
async function getLeadPoint(id: string): Promise<LeadPointInterface> {
    try {
        console.log(id);
        const submittedPointResponse = await axiosInstance.get('/api/submit/point/'+id);
        console.log(submittedPointResponse.data)
        return submittedPointResponse.data as LeadPointInterface;
    } catch(error) {
        return error;
    } 
}


/**
 * Fetch single master point from the API.
 * @returns Promise<SubmittedPoint>
 * @param point - the point for review.
 */
async function addLeadPoints(points: LeadPointInterface[]): Promise<AxiosResponse> {
    return new Promise(async (resolve, reject)=>{
        try {
            const masterPointResponse = await axiosInstance.post('/api/points/leads', points).then((res)=>{
                resolve(res);
            }).catch((res)=>{
                reject(res)
            });
            console.log("Submitted", masterPointResponse)
        } catch(error) {
            reject(error);
        } 
    })
}

/**
 * Fetch single master point from the API.
 * @returns Promise<SubmittedPoint>
 * @param point - the point for review.
 */
async function addLeadPoint(point: LeadPointInterface): Promise<AxiosResponse> {
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
async function deleteOneLeadPointByID(id: string): Promise<AxiosResponse> {
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
async function updateOneLeadPointByID(id: string, point: SubmittedPoint): Promise<AxiosResponse> {
    try {
        const masterPointResponse = await axiosInstance.put('/api/points/leads' + id, point);
        return masterPointResponse;
    } catch(error) {
        
        return error;
    } 
}

export {
    getAllLeadPoints,
    getLeadPoint,
    addLeadPoint,
    addLeadPoints,
    deleteOneLeadPointByID,
    updateOneLeadPointByID
}
