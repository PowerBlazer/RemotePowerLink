import axios, { AxiosError, AxiosInstance } from 'axios';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
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

export class HostService {
    static _apiHost: string = process.env.API_HOST;

    private static _api: AxiosInstance = null;

    static get api (): AxiosInstance {
        if (!this._api) {
            this._api = axios.create({
                withCredentials: true,
                baseURL: this._apiHost + '/api/'
            });

            this._api.interceptors.response.use(
                (response) => response,
                (error: AxiosError) => {
                    if ((error.response?.status === 401 ||
                        error.response?.status === 400 ||
                        error.response?.status === 404) &&
                        allowAnonymousEndpoints.some(
                            endpoint => error.request.responseURL.includes(endpoint))
                    ) {
                        throw error;
                    }

                    if (error.response?.status === 401) {
                        history.push('login')
                    }

                    alert(error.message)
                }
            );
        }

        return this._api;
    }
}
