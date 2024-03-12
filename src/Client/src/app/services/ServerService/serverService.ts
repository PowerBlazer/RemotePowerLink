import {
    CreateServerData,
    CreateServerResult,
    EditServerData, EditServerResult,
    ServerData
} from 'app/services/ServerService/config/serverConfig';
import { ApiResult, HostService, ServiceResult } from 'app/services/hostService';

export class ServerService {
    static createServer = async (createServerData: CreateServerData): Promise<ServiceResult<CreateServerResult>> => {
        try {
            const response =
                await HostService.api.post<ApiResult<CreateServerResult>>(
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
    
    static editServer = async (editServerData: EditServerData): Promise<ServiceResult<EditServerResult>> => {
        try {
            
            if(editServerData.sshPort === ""){
                editServerData.sshPort = null;
            }
            
            const response =
                await HostService.api.post<ApiResult<EditServerResult>>(
                    '/v1/server/edit',
                    editServerData
                );

            return {
                isSuccess: true,
                result: response.data.result
            }
        }
        catch (error) {
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

    static deleteServer = async (serverId: number): Promise<ServiceResult<number>> => {
        try {
            await HostService.api.delete(`/v1/server/${serverId}`);

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
