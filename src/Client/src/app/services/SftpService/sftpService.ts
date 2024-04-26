import {
    CreateDirectoryData,
    DeleteFoldersOrFilesData, DownloadFoldersOrFilesData, GetSizeFoldersOrFilesData,
    RenameFoldersOrFilesData
} from 'app/services/SftpService/config';
import { ApiResult, HostService, ServiceResult } from 'app/services/hostService';

export class SftpService {
    static createDirectory = async (createDirectoryData: CreateDirectoryData): Promise<ServiceResult<any>> => {
        try {
            await HostService.api.post<ApiResult<any>>(
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
    static deleteFilesOrFolders = async (deleteFilesOrFolderData: DeleteFoldersOrFilesData): Promise<ServiceResult<any>> => {
        try {
            await HostService.api.post<ApiResult<any>>(
                '/v1/sftp/delete',
                deleteFilesOrFolderData
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
    static renameFileOrFolder = async (renameFileOrFolderData: RenameFoldersOrFilesData): Promise<ServiceResult<number>> => {
        try {
            await HostService.api.post<ApiResult<any>>(
                '/v1/sftp/rename',
                renameFileOrFolderData
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
    static getSizeFoldersOrFiles = async (getSizeFoldersOrFilesData: GetSizeFoldersOrFilesData): Promise<ServiceResult<number>> => {
        try {
            const response = await HostService.api.post<ApiResult<number>>(
                '/v1/sftp/size',
                getSizeFoldersOrFilesData
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
    
    static download = async (downloadFoldersOrFilesData: DownloadFoldersOrFilesData): Promise<ServiceResult<any>> => {
        try {
            const response = await HostService.api.post(
                '/v1/sftp/download',
                downloadFoldersOrFilesData,
                {
                    responseType: 'blob',
                    timeout: 3600000,
                    onDownloadProgress: function (progressEvent){
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        console.log(`Прогресс загрузки: ${progress}%`);
                    }
                });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'downloaded_files.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

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
