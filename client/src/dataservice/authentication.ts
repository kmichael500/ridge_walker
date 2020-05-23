import axios, { AxiosResponse } from 'axios';
import { serverBaseURL } from '../config/urlConfig';
import { RegisterUserInterface, UserInterface } from '../interfaces/UserInterface'
import qs from 'qs';
import { useContext } from 'react';
import { userContext } from '../context/userContext';
import { SubmittedPoint } from '../interfaces/submittedPointInterface';

const axiosInstance = axios.create({
    baseURL: serverBaseURL
});

// gets the secret token for API
const params = {
    secret_token: localStorage.getItem("JWT")
}

/**
 * Register a user.
 * @param password - users password.
 * @param email - users email
 */
async function registerUser(newUser: RegisterUserInterface): Promise<RegisterUserInterface> {

    return new Promise(async (resolve, reject) => {
        try {
            const getRegisterResponse = await axios({
                method: 'post',
                url: serverBaseURL+'api/user/signup',
                params:{
                    email: newUser.user.email,
                    password: newUser.user.password
                },
                data: qs.stringify(newUser.user),
                headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });
            console.log(getRegisterResponse)
            resolve(getRegisterResponse.data as RegisterUserInterface);
        } catch(error) {
            reject(error.response.data.message);
        }
    })
}

/**
 * Login a user.
 * @param password - users password.
 * @param email - users email
 */
async function loginUser(email: string, password: string): Promise<UserInterface> {
    return new Promise(async (resolve, reject) => {
        try {
            const getLoginResponse = await axios({
                method: 'post',
                url: serverBaseURL+'api/user/login',
                data: qs.stringify({
                    email,
                    password
                }),
                headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });
    
            localStorage.setItem('JWT', getLoginResponse.data.token);
            params.secret_token = getLoginResponse.data.token;
            resolve(getLoginResponse.data.user as UserInterface);
        } catch(error) {
            reject(error.response.data.message);
        }
    })
}

/**
 * Check if a user is logged in.
 * @param password - users password.
 * @param email - users email
 */
async function getCurrentUserProfile(): Promise<UserInterface> {
    return new Promise(async (resolve, reject) => {
        try {
            if (localStorage.getItem("JWT") === null){
                reject("No JWT key");
            }
            else{
                const user  = await axiosInstance.get('api/user/profile',{params});

                resolve (user.data as UserInterface);    
            }
        } catch(error) {
            reject(error);
        }
    })
}

function logoutUser(): void {
    localStorage.removeItem("JWT");
    params.secret_token = "";
}

/**
 * Fetch single user from the API.
 * @returns Promise<UserInterface>
 * @param id - the mongo id of the user.
 */
async function getOneUserByID(id: string): Promise<UserInterface> {
    try {
        const userResponse = await axiosInstance.get('/api/user/'+id, {params});
        return userResponse.data as UserInterface;
    } catch(error) {
        return error;
    } 
}

/**
 * Fetch points that the current user submitted.
 * @returns Promise<SubmittedPoint[]>
 * @param id - the mongo id of the user.
 */
async function getCurrentUserSubmissions(): Promise<SubmittedPoint[]> {
    try {
        const userResponse = await axiosInstance.get('/api/user/submissions', {params});
        return userResponse.data as SubmittedPoint[];
    } catch(error) {
        return error;
    } 
}



export {
    registerUser,
    loginUser,
    getCurrentUserProfile as getUserProfile,
    logoutUser,
    getOneUserByID,
    getCurrentUserSubmissions
}