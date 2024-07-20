import {ChangePasswordData, UserData} from 'app/services/UserService/config/userConfig';
import { ApiResult, HostService, ServiceResult } from 'app/services/hostService';

export class UserService {
    static getUserData = async (): Promise<ServiceResult<UserData>> => {
        try {
            const response =
                await HostService.api.get<ApiResult<UserData>>('/v1/user');

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
    
    static changePassword = async (changePasswordData: ChangePasswordData): Promise<ServiceResult<any>> => {
        try {
            await HostService.api.put('/v1/user/password', changePasswordData)

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
