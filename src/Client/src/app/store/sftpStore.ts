import { ServerData } from 'app/services/ServerService/config/serverConfig';
import SftpHub from 'app/hubs/SftpHub';
import { FileType, SftpCatalogMode, SftpFile, SftpFileList } from 'app/services/SftpService/config/sftpConfig';
import { makeAutoObservable, observable } from 'mobx';
import { Stack } from 'shared/lib/Stack';

export interface SftpServer {
    server: ServerData,
    sftpHub?: SftpHub,
    sftpFilesOption: SftpFilesOption
    error?: SftpError,
    menuOption?: SftpMenuOption,
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

export interface SftpFilesOption {
    sftpFileList?: SftpFileList,
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

export interface SftpError {
    errors: Record<string, string[]>
}

class SftpStore {
    constructor () {
        makeAutoObservable(this)
    }

    @observable public firstSelectedHost: SftpServer | null = null;
    @observable public secondSelectedHost: SftpServer | null = null;

    @observable public firstHostFileItems: SftpFile[] = [];
    @observable public secondHostFileItems: SftpFile[] = [];
    @observable public editableWidthSplit: boolean = false;

    getFileItemsInMode (mode: SftpCatalogMode): SftpFile[] {
        return mode === SftpCatalogMode.First
            ? this.firstHostFileItems
            : this.secondHostFileItems;
    }

    getSelectedHostInMode (mode: SftpCatalogMode): SftpServer | null {
        return mode === SftpCatalogMode.First
            ? this.firstSelectedHost
            : this.secondSelectedHost;
    }

    setFileItems (mode: SftpCatalogMode) {
        const selectedHost = this.getSelectedHostInMode(mode);

        let hostFileItems = selectedHost?.sftpFileList?.fileList;
        const filterOptions = selectedHost?.filterOptions;

        if (filterOptions.title) {
            hostFileItems = hostFileItems.filter(
                p => p.name?.toLowerCase().includes(filterOptions.title?.toLowerCase()) ||
                    p.fileTypeName?.toLowerCase().includes(filterOptions.title?.toLowerCase())
            )
        }

        if (filterOptions.columnSort) {
            hostFileItems = [...hostFileItems].sort((a, b) => {
                if (filterOptions.columnSort.columnKey === 'fileTypeName') {
                    return compareFileTypeName(a, b, filterOptions.columnSort.isReverse)
                }

                if (filterOptions.columnSort.columnKey === 'size') {
                    return compareSizes(a, b, filterOptions.columnSort.isReverse)
                }

                return filterOptions.columnSort.isReverse
                    ? compareReverse(a[filterOptions.columnSort.columnKey], b[filterOptions.columnSort.columnKey])
                    : compare(a[filterOptions.columnSort.columnKey], b[filterOptions.columnSort.columnKey])
            })
        }

        if (mode === SftpCatalogMode.First) {
            this.firstHostFileItems = hostFileItems;
        }

        if (mode === SftpCatalogMode.Second) {
            this.secondHostFileItems = hostFileItems;
        }
    }

    setSftpFilterOptions (mode: SftpCatalogMode, options: SftpFilterOptions) {
        if (mode === SftpCatalogMode.First) {
            this.firstSelectedHost.filterOptions = {
                ...options
            }
        }

        if (mode === SftpCatalogMode.Second) {
            this.secondSelectedHost.filterOptions = {
                ...options
            }
        }

        this.setFileItems(mode);
    }

    setSelectFileItem (mode: SftpCatalogMode, path: string, isClean: boolean = true, isAlwaysSelect: boolean = false) {
        const selectedFileItems = this.getFileItemsInMode(mode);

        if (mode === SftpCatalogMode.First && isClean) {
            this.firstHostFileItems.forEach((file) => {
                file.isSelected = false;
            })
        }

        if (mode === SftpCatalogMode.Second && isClean) {
            this.secondHostFileItems.forEach((file) => {
                file.isSelected = false;
            })
        }

        const fileItems = [...selectedFileItems];
        const selectFileIndex = fileItems.findIndex(p => p.path === path);

        if (selectFileIndex !== -1 && fileItems[selectFileIndex].fileType === 3) {
            return;
        }

        if (selectFileIndex !== -1 && mode === SftpCatalogMode.First) {
            if (isAlwaysSelect && fileItems[selectFileIndex].isSelected) {
                fileItems[selectFileIndex].isSelected = true;
                this.firstHostFileItems = fileItems;
                return;
            }

            if (isAlwaysSelect && !fileItems[selectFileIndex].isSelected) {
                this.firstHostFileItems.forEach((file) => {
                    file.isSelected = false;
                })

                fileItems[selectFileIndex].isSelected = true;
                this.firstHostFileItems = fileItems;
                return;
            }

            fileItems[selectFileIndex].isSelected = !fileItems[selectFileIndex].isSelected;
            this.firstHostFileItems = fileItems;
        }

        if (selectFileIndex !== -1 && mode === SftpCatalogMode.Second) {
            if (isAlwaysSelect && fileItems[selectFileIndex].isSelected) {
                fileItems[selectFileIndex].isSelected = true;
                this.secondHostFileItems = fileItems;
                return;
            }

            if (isAlwaysSelect && !fileItems[selectFileIndex].isSelected) {
                this.secondHostFileItems.forEach((file) => {
                    file.isSelected = false;
                })

                fileItems[selectFileIndex].isSelected = true;
                this.secondHostFileItems = fileItems;
                return;
            }

            fileItems[selectFileIndex].isSelected = !fileItems[selectFileIndex].isSelected;
            this.secondHostFileItems = fileItems;
        }
    }

    setSelectAllInFilter (mode: SftpCatalogMode) {
        if (mode === SftpCatalogMode.First) {
            this.firstHostFileItems.filter(p => p.fileType !== FileType.BackNavigation).forEach(file => {
                file.isSelected = true
            })
        }

        if (mode === SftpCatalogMode.Second) {
            this.secondHostFileItems.forEach(file => {
                file.isSelected = true
            })
        }
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
