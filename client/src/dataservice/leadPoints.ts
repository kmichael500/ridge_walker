import axios, { AxiosResponse } from 'axios';
import { serverBaseURL } from '../config/urlConfig';
import { SubmittedPoint } from '../interfaces/submittedPointInterface'
import { LeadPointInterface } from '../interfaces/LeadPointInterface';

const axiosInstance = axios.create({
    baseURL: serverBaseURL
});

/**
 * Fetch all lead points from the API.
 * @returns Promise<SubmittedPoint[]>
 */
async function getAllLeadPoints(): Promise<LeadPointInterface[]> {
    try {
        const getLeadPointResponse = await axiosInstance.get('/api/points/leads');
        return getLeadPointResponse.data as LeadPointInterface[];
    } catch(error) {
        return error;
    } 
}

/**
 * Fetch single submitted lead point from the API.
 * @returns Promise<SubmittedPoint>
 * @param id - the mongo id of a lead point.
 */
async function getLeadPoint(id: string): Promise<LeadPointInterface> {
    try {
        const getLeadPointResponse = await axiosInstance.get('/api/submit/point/'+id);
        return getLeadPointResponse.data as LeadPointInterface;
    } catch(error) {
        return error;
    } 
}


/**
 * Add am array lead point to the database.
 * @returns Promise<SubmittedPoint>
 * @param point - the point for review.
 */
async function addLeadPoints(points: LeadPointInterface[]): Promise<AxiosResponse> {
    return new Promise(async (resolve, reject)=>{
        try {
            const leadPointResponse = await axiosInstance.post('/api/points/leads', points).then((res)=>{
                resolve(res);
            }).catch((res)=>{
                reject(res)
            });
        } catch(error) {
            reject(error);
        } 
    })
}

/**
 * Add single lead point to the database.
 * @returns Promise<SubmittedPoint>
 * @param point - the point to submit
 */
async function addLeadPoint(point: LeadPointInterface): Promise<AxiosResponse> {
    try {
        const leadPointResponse = await axiosInstance.post('/api/submit/point/', point);
        return leadPointResponse;
    } catch(error) {
        
        return error;
    } 
}

/**
 * Delete a single lead point by id
 * @returns void
 * @param id - the id of the point for deletion.
 */
async function deleteOneLeadPointByID(id: string): Promise<AxiosResponse> {
    try {
        const leadPointResponse = await axiosInstance.delete('/api/submit/point/' + id);
        return leadPointResponse;
    } catch(error) {
        
        return error;
    } 
}

/**
 * Updates a single submitted point by id
 * @returns void
 * @param id - the id of the point to update.
 */
async function updateOneLeadPointByID(id: string, point: SubmittedPoint): Promise<AxiosResponse> {
    try {
        const leadPointResponse = await axiosInstance.put('/api/points/leads' + id, point);
        return leadPointResponse;
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
