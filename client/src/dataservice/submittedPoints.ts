import axios, {AxiosResponse} from 'axios';
import {serverBaseURL} from '../config/urlConfig';
import {SubmittedPoint} from '../interfaces/submittedPointInterface';

const axiosInstance = axios.create({
  baseURL: serverBaseURL,
});

/**
 * Fetch all submitted points from the API.
 * @returns Promise<SubmittedPoint[]>
 */
async function getAllSubmittedPoints(): Promise<SubmittedPoint[]> {
  try {
    const submittedPointResponse = await axiosInstance.get(
      '/api/submit/point',
      {params:{secret_token: localStorage.getItem('JWT')}}
    );
    return submittedPointResponse.data as SubmittedPoint[];
  } catch (error) {
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
    const submittedPointResponse = await axiosInstance.get(
      '/api/submit/point/' + id,
      {params:{secret_token: localStorage.getItem('JWT')}}
    );
    return submittedPointResponse.data as SubmittedPoint;
  } catch (error) {
    return error;
  }
}

/**
 * Add a single point to the database.
 * @returns Promise<SubmittedPoint>
 * @param point - the point for review.
 */
async function addSubmittedPoint(
  point: SubmittedPoint
): Promise<AxiosResponse> {
  try {
    const submittedPointResponse = await axiosInstance.post(
      '/api/submit/point/',
      point,
      {params:{secret_token: localStorage.getItem('JWT')}}
    );
    return submittedPointResponse;
  } catch (error) {
    return error;
  }
}

/**
 * Delete a single submitted point by id
 * @returns Promise<AxiosResponse>
 * @param id - the id of the point for deletion.
 */
async function deleteOneSubmittedPointByID(id: string): Promise<AxiosResponse> {
  try {
    const submittedPointResponse = await axiosInstance.delete(
      '/api/submit/point/' + id,
      {params:{secret_token: localStorage.getItem('JWT')}}
    );
    return submittedPointResponse;
  } catch (error) {
    return error;
  }
}

/**
 * Updates a single submitted point by id
 * @returns void
 * @param id - the id of the point to be updated.
 * @param point - the updated point information.
 */
async function updateOneSubmittedPointByID(
  id: string,
  point: SubmittedPoint
): Promise<AxiosResponse> {
  try {
    const submittedPointResponse = await axiosInstance.put(
      '/api/submit/point/' + id,
      point,
      {params:{secret_token: localStorage.getItem('JWT')}}
    );
    return submittedPointResponse;
  } catch (error) {
    return error;
  }
}

export {
  getAllSubmittedPoints,
  getSubmittedPoint,
  addSubmittedPoint,
  deleteOneSubmittedPointByID,
  updateOneSubmittedPointByID,
};
