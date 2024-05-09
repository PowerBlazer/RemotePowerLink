export enum FileType {
    Folder = 1,
    File = 2,
    BackNavigation = 3
}

export enum SftpCatalogMode {
    First = 'FIRST',
    Second = 'SECOND'
}

export interface SftpFile {
    name: string,
    dateModified?: string
    size?: string,
    fileType: FileType,
    fileTypeName?: string
    path: string,
    isSelected?: boolean
}

export interface SftpFileList {
    currentPath: string,
    prevPath?: string
    fileList: SftpFile[]
}

export interface CreateDirectoryData {
    directoryPath: string,
    directoryName: string,
    serverId: number
}

export interface DeleteFoldersOrFilesData {
    filesOrFoldersToDeleteList: SftpFile[]
    serverId: number
}

export interface RenameFoldersOrFilesData {
    fileItemPath: string,
    fileItemNewName: string,
    serverId: number
}

export interface GetSizeFoldersOrFilesData {
    foldersOrFiles: SftpFile[]
    serverId: number
}

export interface DownloadFoldersOrFilesData {
    filesOrFoldersToDownloadList: SftpFile[],
    serverId: number,
    connectionId: string
}

export interface UploadFilesData {
    uploadFiles: File[],
    uploadPath: string,
    serverId: number,
    connectionId: string
}

export interface ExistDirectoryOrFileData{
    folderOrFilePath: string,
    serverId: number
}
