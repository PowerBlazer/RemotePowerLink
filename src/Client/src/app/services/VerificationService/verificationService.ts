import { ApiResult, AuthorizationResult, HostService, ServiceResult } from "app/services/hostService";
import {
    ResendCodeToConfirmEmailModel,
    ResendCodeToConfirmEmailResponse,
    ResendCodeToUpdatePasswordData,
    ResendCodeToUpdatePasswordResponse,
    SendCodeToConfirmEmailModel,
    SendCodeToConfirmEmailResponse, 
    SendCodeToUpdatePasswordResponse,
    VerifyCodeToConfirmEmailModel, 
    VerifyCodeToUpdatePasswordData
} from "./config";
import { AuthorizationService } from "app/services/AuthorizationService/authorizationService";


class VerificationService {
    static sendCodeToConfirmEmail = async (sendCodeToConfirmEmailModel: SendCodeToConfirmEmailModel): Promise<AuthorizationResult> => {
        try {
            const response =
                await HostService.api.post<ApiResult<SendCodeToConfirmEmailResponse>>(
                    '/v1/verification/SendCodeToConfirmEmail',
                    sendCodeToConfirmEmailModel
                );

            AuthorizationService.setSessionId(response.data.result.sessionId);

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

    static verifyCodeToConfirmEmail = async (verifyCodeToConfirmEmailModel: VerifyCodeToConfirmEmailModel): Promise<AuthorizationResult> => {
        try {
            await HostService.api.put<ApiResult<SendCodeToConfirmEmailResponse>>(
                '/v1/verification/VerifyCodeToConfirmEmail',
                verifyCodeToConfirmEmailModel
            );

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

    static resendCodeToConfirmEmail = async (resendCodeToConfirmEmailModel: ResendCodeToConfirmEmailModel): Promise<AuthorizationResult> => {
        try {
            const response =
                await HostService.api.put<ApiResult<ResendCodeToConfirmEmailResponse>>(
                    '/v1/verification/ResendCodeToConfirmEmail',
                    resendCodeToConfirmEmailModel
                );

            AuthorizationService.setSessionId(response.data.result.sessionId);

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

    
    static resendCodeToUpdatePassword = async (resendCodeToUpdatePasswordData: ResendCodeToUpdatePasswordData):
        Promise<ServiceResult<ResendCodeToUpdatePasswordResponse>> => {

        try {
            const response = await HostService.api.post<ApiResult<ResendCodeToUpdatePasswordResponse>>(
                '/v1.0/verification/ResendCodeToUpdatePassword',
                resendCodeToUpdatePasswordData)

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

    static sendCodeToUpdatePassword = async (): Promise<ServiceResult<SendCodeToUpdatePasswordResponse>> => {

        try {
            const response = await HostService.api.post<ApiResult<SendCodeToUpdatePasswordResponse>>(
                '/v1.0/verification/SendCodeToUpdatePassword');

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

    static verifyCodeToUpdatePassword = async (verifyCodeToUpdatePasswordData: VerifyCodeToUpdatePasswordData): Promise<ServiceResult<any>> => {

        try {
            await HostService.api.post('/v1.0/verification/VerifyCodeToUpdatePassword', verifyCodeToUpdatePasswordData);

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

export {
    VerificationService
}