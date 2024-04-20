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

export interface DeleteFilesOrFoldersData {
    filesOrFoldersToDeleteList: SftpFile[]
    serverId: number
}

export interface RenameFileOrFolderData {
    fileItemPath: string,
    fileItemNewName: string,
    serverId: number
}
