import { ApiResult, HostService, ServiceResult } from 'app/services/hostService';
import {
    CreateProxyData,
    CreateProxyResult,
    EditProxyData, EditProxyResult,
    ProxyData
} from 'app/services/ProxyService/config/proxyConfig';

export class ProxyService {
    static getProxies = async (): Promise<ServiceResult<ProxyData[]>> => {
        try {
            const response =
                await HostService.api.get<ApiResult<ProxyData[]>>('/v1/proxy');

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

    static createProxy = async (createProxyData: CreateProxyData): Promise<ServiceResult<CreateProxyResult>> => {
        try {
            const response =
                await HostService.api.post<ApiResult<CreateProxyResult>>(
                    '/v1/proxy/create',
                    createProxyData
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

    static editProxy = async (editProxyData: EditProxyData): Promise<ServiceResult<EditProxyResult>> => {
        try {
            const response =
                await HostService.api.post<ApiResult<EditProxyResult>>(
                    '/v1/proxy/edit',
                    editProxyData
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