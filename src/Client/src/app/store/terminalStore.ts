import { ServerData } from "app/services/ServerService/config/serverConfig";
import {makeAutoObservable} from "mobx";
import userStore from "app/store/userStore";

export interface TerminalSession {
    id: number
    host?: ServerData,
    histrory: string,
    isLoad: boolean
}


class TerminalStore {
    sessions: TerminalSession[] = [];
    selectedSession: TerminalSession | null = null;
    
    
    constructor() {
        makeAutoObservable(this)
    }
}

export default new TerminalStore();