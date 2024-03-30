import { ServerData } from 'app/services/ServerService/config/serverConfig';
import SftpHub from 'app/hubs/SftpHub';
import { SftpCatalogMode, SftpFile, SftpFileList } from 'app/services/SftpService/config/sftpConfig';
import { action, makeAutoObservable, observable } from 'mobx';
import {Stack} from "shared/lib/Stack";

export interface SftpServer {
    server: ServerData,
    sftpHub?: SftpHub,
    sftpFileList?: SftpFileList,
    filterOptions: SftpFilterOptions,
    error: SftpError,
    historyPrevPaths: Stack<string>,
    historyNextPaths: Stack<string>,
    widthPanel?: number
    isLoad: boolean,
}

export interface SftpFilterOptions {
    title?: string
}

export interface SftpError {
    isError: boolean,
    message?: string
}

class SftpStore {
    constructor () {
        makeAutoObservable(this)
    }
    
    @observable public firstSelectedHost: SftpServer | null = null;
    @observable public secondSelectedHost: SftpServer | null = null;

    @observable public firstHostFileItems: SftpFile[] = [];
    @observable public secondHostFileItems: SftpFile[] = [];
    @observable public editableWidthSplit : boolean = false;
    
    @action setFileItems (mode: SftpCatalogMode) {
        if (mode === SftpCatalogMode.First) {
            let hostFileItems = this.firstSelectedHost?.sftpFileList.fileList;
            let filterOptions = this.firstSelectedHost.filterOptions;

            if (filterOptions.title) {
                hostFileItems = hostFileItems.filter(
                    p => p.name?.toLowerCase().includes(filterOptions.title?.toLowerCase()) ||
                    p.fileTypeName?.toLowerCase().includes(filterOptions.title?.toLowerCase())
                )
            }

            this.firstHostFileItems = hostFileItems;
        }

        if (mode === SftpCatalogMode.Second) {
            let hostFileItems = this.secondSelectedHost?.sftpFileList.fileList;
            let filterOptions =  this.secondSelectedHost.filterOptions;
            if (filterOptions.title) {
                hostFileItems = hostFileItems.filter(
                    p => p.name?.toLowerCase().includes(filterOptions.title?.toLowerCase()) ||
                    p.fileTypeName?.toLowerCase().includes(filterOptions.title?.toLowerCase())
                )
            }

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

    setSelectFileItem (mode: SftpCatalogMode, path: string, isClean: boolean = true) {
        if (mode === SftpCatalogMode.First) {
            if (isClean) {
                this.firstHostFileItems.forEach((file) => {
                    file.isSelected = false;
                })
            }

            const fileItems = [...this.firstHostFileItems];
            const selectFileIndex = fileItems.findIndex(p => p.path === path);

            if (selectFileIndex !== -1) {
                fileItems[selectFileIndex].isSelected = !fileItems[selectFileIndex].isSelected;
                this.firstHostFileItems = fileItems;
            }
        }

        if (mode === SftpCatalogMode.Second) {
            if (isClean) {
                this.secondHostFileItems.forEach((file) => {
                    file.isSelected = false;
                })
            }

            const fileItems = [...this.secondHostFileItems];
            const selectFileIndex = fileItems.findIndex(p => p.path === path);

            if (selectFileIndex !== -1) {
                fileItems[selectFileIndex].isSelected = !fileItems[selectFileIndex].isSelected;
                this.secondHostFileItems = fileItems;
            }
        }
    }
}

export default new SftpStore();
