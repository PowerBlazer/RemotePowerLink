import {CreateServerData, ServerData} from 'services/ServerService/config/serverConfig';
import { ApiResult, HostService, ServiceResult } from 'services/hostService';

export class ServerService {
    static createServer = async (createServerData: CreateServerData): Promise<ServiceResult<CreateServerData>> => {
        try {
            const response =
                await HostService.api.post<ApiResult<CreateServerData>>(
                    '/v1/server/create',
                    createServerData
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
    
    static getServers = async (): Promise<ServiceResult<ServerData[]>> => {
        try {
            const response =
                await HostService.api.get<ApiResult<ServerData[]>>('/v1/server',);

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
