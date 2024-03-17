import {ServerData} from "app/services/ServerService/config/serverConfig";
import SftpHub from "app/hubs/SftpHub";
import {SftpFileList} from "app/services/SftpService/config/sftpConfig";
import {makeAutoObservable, observable} from "mobx";

export interface SftpServer {
    server: ServerData,
    sftpHub?: SftpHub,
    sftpFileList?: SftpFileList
    isLoad: boolean
}

class SftpStore {
    constructor() {
        makeAutoObservable(this)
    }
    
    @observable firstSelectedHost: SftpServer | null = null;
    @observable secondSelectedHost: SftpServer | null = null;
}

export default new SftpStore();