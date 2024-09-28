import { ServerData } from "app/services/ServerService/config/serverConfig";
import {makeAutoObservable} from "mobx";

export interface TerminalSession {
    id: number
    host: ServerData,
    content: string
}


class TerminalStore {
    sessions: TerminalSession[] = [];
    selectedSession: TerminalSession | null = null;
    
    
    constructor() {
        makeAutoObservable(this)
    }
}

export default new TerminalStore();