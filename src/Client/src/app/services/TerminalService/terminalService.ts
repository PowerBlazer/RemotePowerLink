import { ApiResult, HostService, ServiceResult } from 'app/services/hostService';
import { TerminalSetting, TerminalTheme, UpdateTerminalSettingData } from 'app/services/TerminalService/config';

export class TerminalService {
    static getThemes = async (): Promise<ServiceResult<TerminalTheme[]>> => {
        try {
            const response = await HostService.api.get<ApiResult<any>>(
                '/v1/terminal/themes'
            );

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

    static getSetting = async (): Promise<ServiceResult<TerminalSetting>> => {
        try {
            const response = await HostService.api.get<ApiResult<any>>(
                '/v1/terminal/setting'
            );

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

    static updateSetting = async (terminalSettingData: UpdateTerminalSettingData): Promise<ServiceResult<TerminalSetting>> => {
        try {
            const response = await HostService.api.post<ApiResult<TerminalSetting>>(
                '/v1/terminal/update-setting',
                terminalSettingData
            );

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
