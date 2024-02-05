import { UserDataResult } from 'services/UserService/config/userConfig';
import { ApiResult, HostService, ServiceResult } from 'services/hostService';

export class UserService {
    static getUserData = async (): Promise<ServiceResult<UserDataResult>> => {
        try {
            const response =
                await HostService.api.get<ApiResult<UserDataResult>>('/v1/user');

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
}
