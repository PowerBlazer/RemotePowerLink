import { ApiResult, HostService } from 'services/hostService';
import { LocalStorageKeys } from 'app/enums/LocalStorageKeys';

interface LoginModel {
    email: string,
    password: string
}

interface LoginResponse {
    accessToken?: string,
    refreshToken?: string,
}

interface LoginResult {
    isSuccess: boolean,
    errors?: Record<string, string[]>
}

class AuthorizationService {
    static login = async (loginModel: LoginModel): Promise<LoginResult> => {
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
}

export {
    type LoginModel,
    type LoginResponse,
    AuthorizationService
};
