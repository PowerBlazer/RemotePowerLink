import {
    ChangePasswordData,
    ResendResetPasswordCodeData,
    ResendResetPasswordCodeResponse, SendCodeResetPasswordCodeResponse, UpdateUserData,
    UserData, VerifyResetPasswordCodeData
} from 'app/services/UserService/config';
import { ApiResult, HostService, ServiceResult } from 'app/services/hostService';

export class UserService {
    static getUserData = async (): Promise<ServiceResult<UserData>> => {
        try {
            const response =
                await HostService.api.get<ApiResult<UserData>>('/v1/user');

            return {
                isSuccess: true,
                result: response.data.result
            };
        } catch (e) {
            return {
                isSuccess: false
            }
        }
    }
    
    static updateUserData = async (updateUserData: UpdateUserData): Promise<ServiceResult<UserData>> => {
        try {
            const response =
                await HostService.api.put<ApiResult<UserData>>('/v1.0/user/update', updateUserData);

            return {
                isSuccess: true,
                result: response.data.result
            };
        } catch (e) {
            return {
                isSuccess: false,
                errors: e.response?.data.Errors
            }
        }
    }
    
    static changePassword = async (changePasswordData: ChangePasswordData): Promise<ServiceResult<any>> => {
        try {
            await HostService.api.put('/v1/user/password', changePasswordData)

            return {
                isSuccess: true,
            };
        } catch (error) {
            return {
                isSuccess: false,
                errors: error.response?.data.Errors
            }
        }
    }

    static resendResetPasswordCode = async (resendResetPasswordCodeData: ResendResetPasswordCodeData): 
        Promise<ServiceResult<ResendResetPasswordCodeResponse>> => {
        
        try {
            const response = await HostService.api.post<ApiResult<ResendResetPasswordCodeResponse>>(
                '/v1.0/user/ResendResetPasswordCode', 
                resendResetPasswordCodeData)

            return {
                isSuccess: true,
                result: response.data.result
            };
        } catch (error) {
            return {
                isSuccess: false,
                errors: error.response?.data.Errors
            }
        }
    }

    static sendCodeResetPassword = async (): Promise<ServiceResult<SendCodeResetPasswordCodeResponse>> => {

        try {
            const response = await HostService.api.post<ApiResult<SendCodeResetPasswordCodeResponse>>(
                '/v1.0/user/SendCodeResetPassword');

            return {
                isSuccess: true,
                result: response.data.result
            };
        } catch (error) {
            return {
                isSuccess: false,
                errors: error.response?.data.Errors
            }
        }
    }

    static verifyResetPassword = async (verifyResetPasswordCodeData: VerifyResetPasswordCodeData): Promise<ServiceResult<any>> => {

        try {
            await HostService.api.post('/v1.0/user/VerifyResetPasswordCode', verifyResetPasswordCodeData);

            return {
                isSuccess: true,
            };
        } catch (error) {
            return {
                isSuccess: false,
                errors: error.response?.data.Errors
            }
        }
    }
}
