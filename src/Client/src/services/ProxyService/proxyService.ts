import {ApiResult, HostService, ServiceResult} from "services/hostService";
import {ProxyData} from "services/ProxyService/config/proxyConfig";

export class ProxyService{
    static getProxies = async (): Promise<ServiceResult<ProxyData[]>> => {
        try {
            const response = 
                await HostService.api.get<ApiResult<ProxyData[]>>('/v1/proxy');
           
            return {
                isSuccess: true,
                result: response.data.result
            }
        }
        catch (e) {
            return {
                isSuccess: false
            }
        }
    }
}