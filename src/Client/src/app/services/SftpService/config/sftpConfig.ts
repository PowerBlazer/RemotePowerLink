export enum FileType {
    Folder = 1,
    File = 2
}

export interface SftpFile {
    name: string,
    dateModified?: Date
    size?: string,
    fileType: FileType,
    fileTypeName?: string
    path: string
}

export interface SftpFileList {
    currentPath: string,
    fileList: SftpFile[]
}