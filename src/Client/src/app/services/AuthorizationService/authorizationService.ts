import { ApiResult, AuthorizationResult, HostService } from 'app/services/hostService';
import { LocalStorageKeys } from 'app/enums/LocalStorageKeys';
import {
    LoginModel,
    LoginResponse,
    RefreshTokenModel,
    RefreshTokenResponse,
    RegistrationModel,
    RegistrationResponse
} from './config';

class AuthorizationService {
    static login = async (loginModel: LoginModel): Promise<AuthorizationResult> => {
        try {
            const response =
                await HostService.api.post<ApiResult<LoginResponse>>('/v1/authorization/Login', loginModel);

            this.setRefreshToken(response.data.result.refreshToken);
            this.setAccessToken(response.data.result.accessToken);

            return {
                isSuccess: true
            }
        } catch (error) {
            return {
                isSuccess: false,
                errors: error.response?.data.Errors
            }
        }
    }

    static registration = async (registrationModel: RegistrationModel): Promise<AuthorizationResult> => {
        try {
            const response =
                await HostService.api.post<ApiResult<RegistrationResponse>>(
                    '/v1/authorization/Registration',
                    registrationModel
                );

            this.setRefreshToken(response.data.result.refreshToken);
            this.setAccessToken(response.data.result.accessToken);

            return {
                isSuccess: true
            };
        } catch (error) {
            return {
                isSuccess: false,
                errors: error.response?.data.Errors
            };
        }
    }

    static refreshToken = async (): Promise<AuthorizationResult> => {
        const refreshTokenModel: RefreshTokenModel = {
            accessToken: this.getAccessToken(),
            refreshToken: this.getRefreshToken()
        }

        try {
            const response = await HostService.apiWithoutInterceptors.post<ApiResult<RefreshTokenResponse>>(
                'v1/authorization/Refresh',
                refreshTokenModel
            );

            this.setAccessToken(response.data.result.accessToken);
            this.setRefreshToken(response.data.result.refreshToken);

            return {
                isSuccess: true
            }
        } catch (e) {
            console.log('error')
            return {
                isSuccess: false
            }
        }
    }

    static logout = () => {
        this.setAccessToken('');
        this.setRefreshToken('');
    }

    static getAccessToken = (): string => {
        return window.localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN)
    }

    static setAccessToken = (accessToken: string): string => {
        window.localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, accessToken);

        return accessToken;
    }

    static getRefreshToken = (): string => {
        return window.localStorage.getItem(LocalStorageKeys.REFRESH_TOKEN)
    }

    static setRefreshToken = (refreshToken: string): string => {
        window.localStorage.setItem(LocalStorageKeys.REFRESH_TOKEN, refreshToken);

        return refreshToken;
    }

    static getSessionId = (): string => {
        return window.localStorage.getItem(LocalStorageKeys.AUTH_SESSION_ID)
    }

    static setSessionId = (sessionId: string): string => {
        window.localStorage.setItem(LocalStorageKeys.AUTH_SESSION_ID, sessionId);

        return sessionId;
    }
}

export {
    type LoginModel,
    type LoginResponse,
    AuthorizationService
};
