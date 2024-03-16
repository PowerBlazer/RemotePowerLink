import {ServerData} from "app/services/ServerService/config/serverConfig";

export interface SftpServer {
    server: ServerData,
    isLoad: boolean
}

class SftpStore {
    firstSelectedHost: SftpServer | null = null;
    secondSelectedHost: SftpServer | null = null;
    
    
}

export default new SftpStore();