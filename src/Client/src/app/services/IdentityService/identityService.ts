import { ApiResult, HostService, ServiceResult } from 'app/services/hostService';
import {
    CreateIdentityData,
    CreateIdentityResult,
    EditIdentityData,
    EditIdentityResult,
    IdentityData
} from './config/identityConfig';

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

    static createIdentity = async (createIdentityData: CreateIdentityData):Promise<ServiceResult<CreateIdentityResult>> => {
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
    
    static editIdentity = async (editIdentityData: EditIdentityData): Promise<ServiceResult<EditIdentityResult>> => {
        try {
            const response =
                await HostService.api.post<ApiResult<EditIdentityResult>>(
                    '/v1/identity/edit',
                    editIdentityData
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
    
    static deleteIdentity = async (identityId: number): Promise<ServiceResult<number>> => {
        try {
            await HostService.api.delete(`/v1/identity/${identityId}`);

            return {
                isSuccess: true,
            }
        } catch (error) {
            return {
                isSuccess: false,
                errors: error.response?.data.Errors
            }
        }
    }
}
