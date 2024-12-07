import { ServerData } from 'app/services/ServerService/config/serverConfig';
import SftpHub from 'app/hubs/sftpHub';
import { FileType, SftpCatalogMode, SftpFile, SftpFileList } from 'app/services/SftpService/config';
import { makeAutoObservable, observable } from 'mobx';
import { Stack } from 'shared/lib/Stack';

export interface SftpServer {
    server: ServerData,
    sftpHub?: SftpHub,
    sftpFileList?: SftpFileList,
    sftpFilesOption: SftpFilesOption
    error?: SftpError,
    menuOption?: SftpMenuOption,
    modalOption: SftpModalOption,
    notificationOptions?: SftpNotificationOptions
    isLoad: boolean,
}

export enum MenuMode {
    Directory = 'DIRECTORY',
    File = 'FILE',
    Default = 'DEFAULT',
    Multitude = 'MULTITUDE'
}

export interface SftpMenuOption {
    x?: number,
    y?: number,
    heightWindow?: number
    isVisible: boolean,
    menuMode: MenuMode
}

export interface SftpModalOption {
    newFolderState: boolean,
    errorState: boolean,
    deleteState: boolean,
    renameState: boolean,
    downloadState: boolean,
    uploadState: boolean,
    sendState: boolean
}

export interface SftpFilesOption {
    fileList?: SftpFile[]
    filterOptions: SftpFilterOptions,
    historyPrevPaths: Stack<string>,
    historyNextPaths: Stack<string>,
    widthPanel?: number,
}

export interface ColumnSort {
    columnKey: keyof SftpFile,
    isReverse: boolean
}

export interface SftpFilterOptions {
    title?: string,
    columnSort?: ColumnSort
}

export interface SftpNotificationData {
    operationName: string,
    informationText?: string,
    isProgress?: boolean,
    progressPercent?: number
}

export interface SftpNotificationOptions {
    data: SftpNotificationData,
    onCancel?: () => void
}

export interface SftpError {
    errors: Record<string, string[]>
}

class SftpStore {
    constructor () {
        makeAutoObservable(this)
    }

    @observable public firstSelectedHost: SftpServer | null = null;
    @observable public secondSelectedHost: SftpServer | null = null;
    @observable public thirdSelectedHost: SftpServer | null = null;

    @observable public editableWidthSplit: boolean = false;

    getHostInMode (mode: SftpCatalogMode): SftpServer | null {
        switch (mode) {
            case SftpCatalogMode.First:
                return this.firstSelectedHost;
            case SftpCatalogMode.Second:
                return this.secondSelectedHost;
            case SftpCatalogMode.THIRD:
                return this.thirdSelectedHost;
            default:
                return null
        }
    }

    setHostInMode (mode: SftpCatalogMode, host: SftpServer | null) {
        switch (mode) {
            case SftpCatalogMode.First:
                this.firstSelectedHost = host;
                break;
            case SftpCatalogMode.Second:
                this.secondSelectedHost = host;
                break;
            case SftpCatalogMode.THIRD:
                this.thirdSelectedHost = host;
                break;
        }
    }

    setFileItems (mode: SftpCatalogMode) {
        const selectedHost = this.getHostInMode(mode);

        let hostFileItems = selectedHost?.sftpFileList?.fileList;
        const filterOptions = selectedHost?.sftpFilesOption.filterOptions;

        if (filterOptions?.title && hostFileItems) {
            hostFileItems = hostFileItems.filter(
                p => p.name?.toLowerCase().includes(filterOptions.title?.toLowerCase()) ||
                    p.fileTypeName?.toLowerCase().includes(filterOptions.title?.toLowerCase())
            )
        }

        if (filterOptions.columnSort && hostFileItems) {
            hostFileItems = [...hostFileItems]
                .sort((a, b) => {
                    const aIsBackNavifation = a.fileType === FileType.BackNavigation;
                    const bIsBackNavifation = b.fileType === FileType.BackNavigation;

                    if ((aIsBackNavifation && !bIsBackNavifation) || (!aIsBackNavifation && bIsBackNavifation)) {
                        return 1;
                    }

                    if (filterOptions.columnSort.columnKey === 'fileTypeName') {
                        return compareFileTypeName(a, b, filterOptions.columnSort.isReverse)
                    }

                    if (filterOptions.columnSort.columnKey === 'size') {
                        return compareSizes(a, b, filterOptions.columnSort.isReverse)
                    }

                    return filterOptions.columnSort.isReverse
                        ? compareReverse(a[filterOptions.columnSort.columnKey], b[filterOptions.columnSort.columnKey])
                        : compare(a[filterOptions.columnSort.columnKey], b[filterOptions.columnSort.columnKey])
                });
        }

        selectedHost.sftpFilesOption = {
            ...selectedHost.sftpFilesOption,
            fileList: hostFileItems
        };
    }

    setSftpFilterOptions (mode: SftpCatalogMode, options: SftpFilterOptions) {
        const selectedHost = this.getHostInMode(mode);

        selectedHost.sftpFilesOption = {
            ...selectedHost.sftpFilesOption,
            filterOptions: options
        }

        this.setFileItems(mode);
    }

    setSelectFileItem (mode: SftpCatalogMode, path: string, isClean: boolean = true, isAlwaysSelect: boolean = false) {
        const selectedFileItems = this.getHostInMode(mode)?.sftpFilesOption.fileList;
        const selectedHost = this.getHostInMode(mode);

        if (isClean) {
            selectedHost.sftpFilesOption.fileList.forEach((file) => {
                file.isSelected = false;
            })
        }

        const fileItems = [...selectedFileItems];
        const selectFileIndex = fileItems.findIndex(p => p.path === path);

        if (selectFileIndex !== -1 && fileItems[selectFileIndex].fileType === FileType.BackNavigation) {
            return;
        }

        if (selectFileIndex !== -1) {
            if (isAlwaysSelect && fileItems[selectFileIndex].isSelected) {
                fileItems[selectFileIndex].isSelected = true;
                selectedHost.sftpFilesOption = {
                    ...selectedHost.sftpFilesOption,
                    fileList: fileItems
                }
                return;
            }

            if (isAlwaysSelect && !fileItems[selectFileIndex].isSelected) {
                selectedHost.sftpFilesOption.fileList.forEach((file) => {
                    file.isSelected = false;
                })

                fileItems[selectFileIndex].isSelected = true;
                selectedHost.sftpFilesOption = {
                    ...selectedHost.sftpFilesOption,
                    fileList: fileItems
                }
                return;
            }

            fileItems[selectFileIndex].isSelected = !fileItems[selectFileIndex].isSelected;

            selectedHost.sftpFilesOption = {
                ...selectedHost.sftpFilesOption,
                fileList: fileItems
            }
        }
    }

    setSelectAllInFilter (mode: SftpCatalogMode) {
        const selectedHost = this.getHostInMode(mode);

        const fileList = [...selectedHost.sftpFilesOption.fileList];

        fileList.filter(p => p.fileType !== FileType.BackNavigation)
            .forEach(file => {
                file.isSelected = true
            });

        selectedHost.sftpFilesOption.fileList = fileList;
    }
}

function compare (a: any, b: any): number {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

function compareReverse (a: any, b: any): number {
    if (a < b) {
        return 1;
    }
    if (a > b) {
        return -1;
    }
    return 0;
}

function compareSizes (a: SftpFile, b: SftpFile, isReverse: boolean): number {
    // Проверка, если один из элементов fileType === 1
    if (a.fileType === 1 && b.fileType !== 1) {
        // Поместить элементы с fileType === 1 в конец
        return 1;
    } else if (a.fileType !== 1 && b.fileType === 1) {
        // Поместить элементы с fileType === 1 в конец
        return -1;
    } else {
        // Оба элемента либо равны fileType === 1, либо оба не равны
        // Сравнить по размеру
        const aSize = parseFloat(a.size || '0');
        const bSize = parseFloat(b.size || '0');
        let result = aSize - bSize;

        // Учитываем направление сортировки
        if (isReverse) {
            result *= -1; // Инвертируем результат для обратной сортировки
        }

        return result;
    }
}

function compareFileTypeName (a: SftpFile, b: SftpFile, isReverse: boolean): number {
    const aTypeName = a.fileTypeName
        ? a.fileTypeName
        : (a.fileType === 1 ? 'folder' : '')

    const bTypeName = b.fileTypeName
        ? b.fileTypeName
        : (b.fileType === 1 ? 'folder' : '');

    return isReverse ? compareReverse(aTypeName, bTypeName) : compare(aTypeName, bTypeName);
}

export default new SftpStore();
