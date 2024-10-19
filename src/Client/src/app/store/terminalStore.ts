import { ServerData } from "app/services/ServerService/config/serverConfig";
import {makeAutoObservable} from "mobx";
import TerminalHub from "app/hubs/terminalHub";

export interface TerminalSession {
    id: number
    host?: ServerData,
    histrory?: string,
    isLoad: boolean
}


class TerminalStore {
    sessions: TerminalSession[] = [];
    selectedSession: TerminalSession | null = null;
    terminalHub: TerminalHub = null;
    
    
    constructor() {
        makeAutoObservable(this)
    }
}

export default new TerminalStore();