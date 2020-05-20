import axios, { AxiosResponse } from 'axios';
import { serverBaseURL } from '../config/urlConfig';
import { UserInterface } from '../interfaces/UserInterface'
import qs from 'qs';

const axiosInstance = axios.create({
    baseURL: serverBaseURL
});

/**
 * Register a user.
 * @param password - users password.
 * @param email - users email
 */
async function registerUser(email: string, password: string): Promise<UserInterface> {

    return new Promise(async (resolve, reject) => {
        try {
            const getRegisterResponse = await axios({
                method: 'post',
                url: serverBaseURL+'api/user/signup',
                data: qs.stringify({
                email,
                password
                }),
                headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });
            console.log(getRegisterResponse)
            resolve(getRegisterResponse.data as UserInterface);
        } catch(error) {
            reject(error.response.data.message);
        }
    })
}

export {
    registerUser
}