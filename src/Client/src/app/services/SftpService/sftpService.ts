import { CreateDirectoryData } from 'app/services/SftpService/config/sftpConfig';
import { ApiResult, HostService, ServiceResult } from 'app/services/hostService';

export class SftpService {
    static createDirectory = async (createDirectoryData: CreateDirectoryData):
    Promise<ServiceResult<any>> => {
        try {
            await HostService.api.post<ApiResult<CreateDirectoryData>>(
                '/v1/sftp/create-directory',
                createDirectoryData
            );

            return {
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
