import {ApiResult, HostService, ServiceResult} from "app/services/hostService";
import {EncodingData} from "app/services/EncodingService/config";
import {IdentityData} from "app/services/IdentityService/config/identityConfig";


export class EncodingService {
    static getEncodings = async (): Promise<ServiceResult<EncodingData[]>> => {
        try {
            const response =
                await HostService.api.get<ApiResult<EncodingData[]>>('/v1/encoding');

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
}