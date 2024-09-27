import {
    CreateDirectoryData,
    DeleteFoldersOrFilesData, DownloadFoldersOrFilesData, ExistDirectoryOrFileData, GetSizeFoldersOrFilesData,
    RenameFoldersOrFilesData, SendFolderOrFilesResponse, SendFoldersOrFilesData, UploadFilesData
} from 'app/services/SftpService/config';
import { ApiResult, HostService, ServiceResult } from 'app/services/hostService';
import { CancelTokenSource } from 'axios';

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

    static existFolerOrFile = async (existDirectoryOrFileData: ExistDirectoryOrFileData): Promise<ServiceResult<boolean>> => {
        try {
            const response = await HostService.api.post<ApiResult<boolean>>(
                '/v1.0/sftp/exist',
                existDirectoryOrFileData
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

    static downloadFoldersOrFiles = async (
        downloadFoldersOrFilesData: DownloadFoldersOrFilesData,
        cancelToken?: CancelTokenSource,
        downloadAction?: (progress: number) => void
    ): Promise<ServiceResult<any>> => {
        try {
            const response = await HostService.api.post(
                '/v1.0/sftp/download',
                downloadFoldersOrFilesData,
                {
                    responseType: 'blob',
                    cancelToken: cancelToken?.token,
                    timeout: 3600000,
                    onDownloadProgress: function (progressEvent) {
                        if (downloadAction && progressEvent.total) {
                            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                            downloadAction(progress)
                        }
                    }
                });

            const contentDisposition = response.headers['content-disposition'];
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            let filename = 'downloaded_files.zip'; // По умолчанию
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '') + '.zip';
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            return {
                isSuccess: true
            }
        } catch (error) {
            if (error?.response?.data.Errors) {
                return {
                    isSuccess: false,
                    errors: error?.response?.data.Errors
                }
            }

            if (error?.message) {
                return {
                    isSuccess: false,
                    errors: { Server: [error?.message] }
                }
            }

            return {
                isSuccess: false
            }
        }
    }

    static uploadFiles = async (
        uploadFilesData: UploadFilesData,
        cancelToken?: CancelTokenSource,
        uploadAction?: (progress: number) => void
    ): Promise<ServiceResult<any>> => {
        try {
            const formData = new FormData();
            formData.append('uploadPath', uploadFilesData.uploadPath);
            formData.append('serverId', uploadFilesData.serverId.toString());
            formData.append('connectionId', uploadFilesData.connectionId);

            uploadFilesData.uploadFiles.forEach(file => {
                formData.append('uploadFiles', file);
            })

            await HostService.api.post(
                '/v1.0/sftp/upload',
                formData,
                {
                    cancelToken: cancelToken?.token,
                    timeout: 3600000,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    maxContentLength: 5368709120,
                    onUploadProgress: function (progressEvent) {
                        if (uploadAction && progressEvent.total) {
                            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                            uploadAction(progress)
                        }
                    }
                }
            );

            return {
                isSuccess: true
            }
        } catch (error) {
            if (error?.response?.data.Errors) {
                return {
                    isSuccess: false,
                    errors: error?.response?.data.Errors
                }
            }

            if (error?.message) {
                return {
                    isSuccess: false,
                    errors: { Server: [error?.message] }
                }
            }

            return {
                isSuccess: false
            }
        }
    }

    static sendFoldersOrFiles = async (
        sendFoldersOrFilesData: SendFoldersOrFilesData,
        cancelToken?: CancelTokenSource
    ): Promise<ServiceResult<SendFolderOrFilesResponse>> => {
        try {
            const response = await HostService.api.post<ApiResult<SendFolderOrFilesResponse>>(
                '/v1.0/sftp/send',
                sendFoldersOrFilesData,
                {
                    cancelToken: cancelToken?.token,
                    timeout: 3600000
                });

            return {
                isSuccess: true,
                result: response.data.result
            }
        } catch (error) {
            if (error?.response?.data.Errors) {
                return {
                    isSuccess: false,
                    errors: error?.response?.data.Errors
                }
            }

            if (error?.message) {
                return {
                    isSuccess: false,
                    errors: { Server: [error?.message] }
                }
            }

            return {
                isSuccess: false
            }
        }
    }
}
