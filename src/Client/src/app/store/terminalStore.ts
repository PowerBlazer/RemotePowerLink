import { ServerData } from 'app/services/ServerService/config/serverConfig';
import { makeAutoObservable } from 'mobx';
import TerminalHub from 'app/hubs/terminalHub';

export interface TerminalSession {
    id: number
    host?: ServerData,
    isLoad: boolean,
    errors?: Record<string, string[]>,
    onOutput?: (data: string) => void
}

export interface TerminalOutputData {
    sessionId: number,
    data?: string;
}

export interface TerminalModalOptions {
    errorState: boolean
}

class TerminalStore {
    sessions: TerminalSession[] = [];
    selectedSession: TerminalSession | null = null;
    terminalHub: TerminalHub = null;

    modalOptions: TerminalModalOptions = {
        errorState: false
    }

    constructor () {
        makeAutoObservable(this)
    }
}

export default new TerminalStore();
