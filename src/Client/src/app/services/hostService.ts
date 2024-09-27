import axios, { AxiosError, AxiosInstance } from 'axios';
import { AuthorizationService } from 'app/services/AuthorizationService/authorizationService';
import toast from 'react-hot-toast';

const allowAnonymousEndpoints: string[] = [
    'Login',
    'SendEmailVerification',
    'ConfirmEmail',
    'Registration'
]

export interface ApiResult<T> {
    result: T,
    errors: Record<string, string[]>
}

export interface ServiceResult<T> {
    isSuccess: boolean,
    errors?: Record<string, string[]>
    result?: T
}

export interface AuthorizationResult {
    isSuccess: boolean,
    errors?: Record<string, string[]>
}

export class HostService {
    static _apiHost: string = process.env.API_HOST;
    static _resourceHost: string = !__IS_DEV__ ? '/resource' : process.env.API_HOST;
    static _hubHost: string = !__IS_DEV__ ? '/hub' : process.env.API_HOST;

    private static _api: AxiosInstance = null;
    private static _apiWithoutInterceptors: AxiosInstance = null;

    public static MaximumDownloadSizeBytes = 5368709120;
    public static MaximumUploadSize = 5368709120;
    public static MaximumSendBytes = 5368709120;

    static get apiWithoutInterceptors (): AxiosInstance {
        if (!this._apiWithoutInterceptors) {
            this._apiWithoutInterceptors = axios.create({
                withCredentials: true,
                baseURL: this._apiHost + '/api/'
            })
        }

        return this._apiWithoutInterceptors;
    }

    static get api (): AxiosInstance {
        if (!this._api) {
            this._api = axios.create({
                withCredentials: true,
                baseURL: this._apiHost + '/api/'
            });

            this._api.interceptors.request.use(
                (config) => {
                    const accessToken = AuthorizationService.getAccessToken();
                    if (accessToken) {
                        config.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return config;
                },
                async (error) => {
                    return await Promise.reject(error);
                }
            );

            this._api.interceptors.response.use(
                (response) => response,
                async (error: AxiosError) => {
                    if ((error.response?.status === 401 ||
                        error.response?.status === 400 ||
                        error.response?.status === 404) &&
                        allowAnonymousEndpoints.some(
                            endpoint => error.request.responseURL.includes(endpoint))
                    ) {
                        throw error;
                    }

                    if (error.response?.status === 401) {
                        const refreshTokenResult = await AuthorizationService.refreshToken();

                        if (refreshTokenResult.isSuccess) {
                            error.config.headers.Authorization = `Bearer ${AuthorizationService.getAccessToken()}`;
                            return await axios.request(error.config);
                        } else {
                            location.pathname = '/login';
                            return;
                        }
                    }

                    toast.error(error.message);

                    throw error;
                }
            );
        }

        return this._api;
    }

    static getCancelToken = () => {
        return axios.CancelToken.source();
    }
}
