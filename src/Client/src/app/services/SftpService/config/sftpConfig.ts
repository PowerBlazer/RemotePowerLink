export enum FileType {
    Folder = 1,
    File = 2
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
    prevPath?:string
    fileList: SftpFile[]
}