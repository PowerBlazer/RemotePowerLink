import { ServerData } from 'app/services/ServerService/config/serverConfig';
import SftpHub from 'app/hubs/SftpHub';
import { SftpCatalogMode, SftpFile, SftpFileList } from 'app/services/SftpService/config/sftpConfig';
import { action, makeAutoObservable, observable } from 'mobx';

export interface SftpServer {
    server: ServerData,
    sftpHub?: SftpHub,
    sftpFileList?: SftpFileList
    isLoad: boolean,
    error: SftpError
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

    public firstFilterOptions: SftpFilterOptions = {};
    public secondFilterOptions: SftpFilterOptions = {};

    @observable public firstSelectedHost: SftpServer | null = null;
    @observable public secondSelectedHost: SftpServer | null = null;

    @observable public firstHostFileItems: SftpFile[] = [];
    @observable public secondHostFileItems: SftpFile[] = [];
    
    @observable isOpenMenu: boolean = false;

    @action setFileItems (mode: SftpCatalogMode) {
        if (mode === SftpCatalogMode.First) {
            let hostFileItems = this.firstSelectedHost?.sftpFileList.fileList;

            if (this.firstFilterOptions.title) {
                hostFileItems = hostFileItems.filter(
                    p => p.name.toLowerCase().includes(this.firstFilterOptions.title.toLowerCase()) ||
                    p.fileTypeName.toLowerCase().includes(this.firstFilterOptions.title.toLowerCase())
                )
            }

            this.firstHostFileItems = hostFileItems;
        }

        if (mode === SftpCatalogMode.Second) {
            let hostFileItems = this.secondSelectedHost?.sftpFileList.fileList;
            if (this.secondFilterOptions.title) {
                hostFileItems = hostFileItems.filter(
                    p => p.name.toLowerCase().includes(this.secondFilterOptions.title.toLowerCase()) ||
                    p.fileTypeName.toLowerCase().includes(this.secondFilterOptions.title.toLowerCase())
                )
            }

            this.secondHostFileItems = hostFileItems;
        }
    }

    setSftpFilterOptions (mode: SftpCatalogMode, options: SftpFilterOptions) {
        if (mode === SftpCatalogMode.First) {
            this.firstFilterOptions = {
                ...options
            }
        }

        if (mode === SftpCatalogMode.Second) {
            this.secondFilterOptions = {
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
