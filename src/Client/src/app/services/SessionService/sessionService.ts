import { CreateSessionData, SessionInstanceData } from 'app/services/SessionService/config';
import { ApiResult, HostService, ServiceResult } from 'app/services/hostService';

export class SessionService {
    static getOpenedSessions = async (): Promise<ServiceResult<SessionInstanceData[]>> => {
        try {
            const response = await HostService.api.get<ApiResult<SessionInstanceData[]>>('v1.0/session/opened');

            return {
                result: response.data.result,
                isSuccess: true
            }
        } catch (error) {
            return {
                isSuccess: false,
                errors: error.response?.data.Errors
            }
        }
    }

    static createSession = async (createSessionData: CreateSessionData): Promise<ServiceResult<SessionInstanceData>> => {
        try {
            const response = await HostService.api.post<ApiResult<SessionInstanceData>>('v1.0/session/create', createSessionData);

            return {
                result: response.data.result,
                isSuccess: true
            }
        } catch (error) {
            return {
                isSuccess: false,
                errors: error.response?.data.Errors
            }
        }
    }
}
