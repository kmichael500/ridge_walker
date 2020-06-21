// API for master TCS Points

import axios, {AxiosResponse} from 'axios';
import {serverBaseURL} from '../config/urlConfig';
import {Feature} from '../interfaces/geoJsonInterface';
import {
  SearchParams,
  MasterPointPaginationReq,
  MasterPointPaginationRes,
} from '../interfaces/MasterPointPagination';

const axiosInstance = axios.create({
  baseURL: serverBaseURL,
});

/**
 * Fetch all master points from the API.
 * @returns Promise<Feature[]>
 */
async function getAllMasterPoints(): Promise<Feature[]> {
  const reqParams = {
    sortOrder: 'desc',
    pagination: false,
    page: 1,
    limit: 10,
    searchParams: {
      name: '',
      tcsnumber: '',
      lengthL: '',
      lengthR: '',
      lengthCmp: '<=',
      pdepL: '',
      pdepR: '',
      pdepCmp: '<=',
      depthL: '',
      depthR: '',
      depthCmp: '<=',
      elevL: '',
      elevR: '',
      elevCmp: '<=',
      psL: '',
      psR: '',
      psCmp: '<=',
      co_name: [],
      ownership: [],
      topo_name: '',
      topo_indi: [],
      gear: [],
      ent_type: [],
      field_indi: [],
      map_status: [],
      geology: '',
      geo_age: '',
      phys_prov: '',
    },
  } as MasterPointPaginationReq;
  try {
    const masterPointResponse = (await axiosInstance.post(
      '/api/points/master',
      reqParams,
      {
        params: {secret_token: localStorage.getItem('JWT')},
      }
    )) as AxiosResponse<MasterPointPaginationRes>;
    return masterPointResponse.data.docs as Feature[];
  } catch (error) {
    return error;
  }
}
/**
 * Get paginated master points and search.
 * @returns Promise<MasterPointPaginationRes>
 */
async function getPaginatedMasterPoints(reqParams: MasterPointPaginationReq): Promise<MasterPointPaginationRes> {
  try {
    const masterPointResponse = (await axiosInstance.post(
      '/api/points/master',
      reqParams,
      {
        params: {secret_token: localStorage.getItem('JWT')},
      }
    )) as AxiosResponse<MasterPointPaginationRes>;
    return masterPointResponse.data;
  } catch (error) {
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
    const masterPointResponse = await axiosInstance.get(
      '/api/points/master/' + tcsnumber,
      {params: {secret_token: localStorage.getItem('JWT')}}
    );
    return masterPointResponse.data as Feature;
  } catch (error) {
    return error;
  }
}

/**
 * Downloads master points as csv or gpx.
 * @returns Promise<void>
 * @param fileType - 'csv' or 'gpx'.
 */
async function downloadMasterPoints(fileType: 'csv' | 'gpx'): Promise<void> {
  try {
    const downloadResponse = await axiosInstance.get(
      '/api/points/master/download/' + fileType,
      {
        responseType: 'blob',
        params: {secret_token: localStorage.getItem('JWT')},
      }
    );
    const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      'TCSDATA' + new Date().getFullYear() + '.' + fileType
    ); //or any other extension
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    return error;
  }
}

export {getAllMasterPoints, getMasterPoint, downloadMasterPoints, getPaginatedMasterPoints};
