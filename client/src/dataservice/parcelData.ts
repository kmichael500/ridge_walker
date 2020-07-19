import axios, {AxiosResponse} from 'axios';
import {serverBaseURL} from '../config/urlConfig';
import {ParcelResponseInterface} from '../interfaces/parcelResponseInterface';
import {Geometry} from '../interfaces/geoJsonInterface';
const axiosInstance = axios.create({
  baseURL: serverBaseURL,
});

/**
 * Get parcel data from coordinates.
 * @param coordinates coordinates of cave
 * @returns Promise<ParcelResponseInterface[]>
 */
async function getParcelByCoordinates(
  coordinates: Geometry
): Promise<ParcelResponseInterface> {
  try {
    const coordinateCopy = JSON.parse(JSON.stringify(coordinates));
    const coordinatesAsString = coordinateCopy.coordinates.reverse().join(',');
    const getLeadPointResponse = await axiosInstance.get(
      '/api/parcel/' + coordinatesAsString,
      {
        params: {secret_token: localStorage.getItem('JWT')},
      }
    );
    return getLeadPointResponse.data as ParcelResponseInterface;
  } catch (error) {
    return error;
  }
}

export {getParcelByCoordinates};
