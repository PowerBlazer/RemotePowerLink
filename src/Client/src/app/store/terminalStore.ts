import { ServerData } from 'app/services/ServerService/config/serverConfig';
import { makeAutoObservable } from 'mobx';
import TerminalHub from 'app/hubs/terminalHub';
import { TerminalSetting, TerminalTheme } from 'app/services/TerminalService/config';

export interface TerminalSession {
    id: number,
    name?: string,
    host?: ServerData,
    isLoad: boolean,
    errors?: Record<string, string[]>,
    onOutput?: (data: string) => void,
    isNew: boolean,
    isCreate: boolean
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

    terminalThemes: TerminalTheme[] = [];
    terminalSetting: TerminalSetting = null;

    modalOptions: TerminalModalOptions = {
        errorState: false
    }

    constructor () {
        makeAutoObservable(this)
    }
}

export default new TerminalStore();
