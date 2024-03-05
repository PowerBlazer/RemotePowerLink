import { ApiResult, HostService, ServiceResult } from 'app/services/hostService';
import { CreateIdentityData, CreateIdentityResult, IdentityData } from './config/identityConfig';

export class IdentityService {
    static getIdentities = async (): Promise<ServiceResult<IdentityData[]>> => {
        try {
            const response =
                await HostService.api.get<ApiResult<IdentityData[]>>('/v1/identity');

            return {
                isSuccess: true,
                result: response.data.result
            }
        } catch (e) {
            return {
                isSuccess: false
            }
        }
    }

    static createIdentity = async (createIdentityData: CreateIdentityData): Promise<ServiceResult<CreateIdentityResult>> => {
        try {
            const response =
                await HostService.api.post<ApiResult<CreateIdentityResult>>(
                    '/v1/identity/create',
                    createIdentityData
                );

            return {
                isSuccess: true,
                result: response.data.result
            }
        } catch (error) {
            return {
                isSuccess: false,
                errors: error.response?.data.Errors
            }
        }
    }
}
