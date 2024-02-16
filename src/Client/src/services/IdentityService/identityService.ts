import {ApiResult, HostService, ServiceResult} from "../hostService";
import {IdentityData} from "./config/identityConfig";

export class IdentityService {
    static getIdentities = async (): Promise<ServiceResult<IdentityData[]>> => {
        try {
            const response =
                await HostService.api.get<ApiResult<IdentityData[]>>('/v1/identity');

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