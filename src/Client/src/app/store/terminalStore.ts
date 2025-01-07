import { ServerData } from 'app/services/ServerService/config/serverConfig';
import {makeAutoObservable, reaction} from 'mobx';
import TerminalHub from 'app/hubs/terminalHub';
import { TerminalSetting, TerminalTheme } from 'app/services/TerminalService/config';
import {LocalStorageKeys} from "app/enums/LocalStorageKeys";

export interface TerminalSession {
    id: number,
    name?: string,
    host?: ServerData,
    isLoad: boolean,
    errors?: Record<string, string[]>,
    onOutput?: (data: string) => void,
    isNew: boolean,
}

export interface TerminalOutputData {
    sessionId: number,
    data?: string;
}

export interface TerminalModalOptions {
    errorState: boolean
}

export enum TerminalScreenSplitMode{
    FIRST = 1,
    DOUBLE = 2,
    TRIPLE = 3,
    QUADRUPLE = 4
}

export interface GroupTerminalSessions {
    index: number,
    selectedSession?: TerminalSession,
    sessions: TerminalSession[]
}

export interface LocalGroupTerminalSessions {
    index: number,
    sessionIds: number[]
}

class TerminalStore {
    selectedMode = this.getScreenModeInStorage();
    groupsTerminalSessions: GroupTerminalSessions[] = [];
   
    terminalHub: TerminalHub = null;
    terminalThemes: TerminalTheme[] = [];
    terminalSetting: TerminalSetting = null;

    modalOptions: TerminalModalOptions = {
        errorState: false
    }
    
    isLoad: boolean = true;

    constructor () {
        makeAutoObservable(this)

        reaction(
            () => this.selectedMode,
            (option) => {
                localStorage.setItem(LocalStorageKeys.TERMINAL_SCREEN_MODE, option.toString());
            }
        );
    }
    
    getGroupSessionsByIndex(index: number): GroupTerminalSessions {
        return this.groupsTerminalSessions[index];
    }
    
    getGroupSessionsBySessionId(sessionId: number): GroupTerminalSessions {
       return this.groupsTerminalSessions.find(p=> 
           p.sessions.findIndex(x=> x.id == sessionId) !== -1);
    }
    
    getSessionBySessionId(sessionId: number): TerminalSession {
        let result: TerminalSession = null
        this.groupsTerminalSessions.forEach(sessionGroup => {
            const session = sessionGroup.sessions.find(p=> p.id == sessionId);
            if (session) {
                result = session;
                return;
            }
        });
        
        return result;
    }
    
    initializeGroupSessions(option: TerminalScreenSplitMode , sessions?: TerminalSession[]) {
        if(this.groupsTerminalSessions.length > option && this.groupsTerminalSessions.length !== 0) {
            const currentTerminalSessions = this.groupsTerminalSessions;
            const slicedSessions = currentTerminalSessions.slice(option);
            
            slicedSessions.forEach((sessionGroup) => {
                currentTerminalSessions[option - 1].sessions = currentTerminalSessions[option - 1].sessions
                    .concat(sessionGroup.sessions);
            })

            this.groupsTerminalSessions = currentTerminalSessions.slice(0, option);
        }
        
        if(this.groupsTerminalSessions.length < option && this.groupsTerminalSessions.length !== 0){
            for (let i = this.groupsTerminalSessions.length; i < option; i++) {
                this.groupsTerminalSessions.push({
                    index: i,
                    sessions: []
                })
            }
        }

        if(this.groupsTerminalSessions.length === 0 && sessions){
            const localGroupsSession = this.getLocalGroupsTerminalSession(option, sessions);
            const newGroupsSession: GroupTerminalSessions[] = []
            
            const foundedSessionIds: number[] = [];
            
            localGroupsSession.forEach((session, index) => {
                let newGroupSessions: TerminalSession[] = [];
                
                session.sessionIds.forEach((sessionId) => {
                    const currentSession = sessions.find(p=> p.id === sessionId);
                    
                    if(currentSession){
                        foundedSessionIds.push(currentSession.id);
                        newGroupSessions.push(currentSession);
                    }
                        
                });

                newGroupsSession.push({
                    index:index, 
                    sessions: newGroupSessions
                })
            })

            const notPresentSessionsInLocalGroup = sessions.filter(
                p=> foundedSessionIds.indexOf(p.id) === -1
            );

            newGroupsSession[0].sessions = newGroupsSession[0].sessions.concat(notPresentSessionsInLocalGroup);

            this.groupsTerminalSessions = newGroupsSession;
        }
        
        this.setLocalGroupsTerminalSession();
    }
    
    updateStorageGroupSessions(){
        this.setLocalGroupsTerminalSession();
    }

    private getScreenModeInStorage(): TerminalScreenSplitMode {
        const screenMode = Number(localStorage.getItem(LocalStorageKeys.TERMINAL_SCREEN_MODE));

        return screenMode ? (screenMode as TerminalScreenSplitMode) : TerminalScreenSplitMode.FIRST;
    }
    
    private getLocalGroupsTerminalSession(option: TerminalScreenSplitMode, sessions: TerminalSession[]): LocalGroupTerminalSessions[] {
        const localGroupJson = localStorage.getItem(LocalStorageKeys.TERMINAL_SESSIONS_GROUPS);
        
        if(!localGroupJson){
            const localGroupArray: LocalGroupTerminalSessions[] = [];
            for (let i = 0; i < option; i++){
                localGroupArray.push({
                    index: i,
                    sessionIds: []
                })
            }
            
            localStorage.setItem(LocalStorageKeys.TERMINAL_SESSIONS_GROUPS, JSON.stringify(localGroupArray));
            
            return localGroupArray;
        }
        
        const localGroupSessions = JSON.parse(localGroupJson) as LocalGroupTerminalSessions[];
        
        if(localGroupJson && localGroupSessions){
            const localGroupArray: LocalGroupTerminalSessions[] = [];
            for (let i = 0; i < option; i++){
                const localGroup = localGroupSessions.find(p=> p.index === i);
                const newLocalGroup: LocalGroupTerminalSessions = {
                    index: i,
                    sessionIds: [] as number[]
                }
                
                if(localGroup){
                    localGroup.sessionIds.forEach(sessionId => {
                        if(sessions.find(p => p.id === sessionId)){
                            newLocalGroup.sessionIds.push(sessionId);
                        }
                    })
                }
                
                localGroupArray.push(newLocalGroup);
            }

            localStorage.setItem(LocalStorageKeys.TERMINAL_SESSIONS_GROUPS, JSON.stringify(localGroupArray));
            
            return localGroupArray;
        }
        
        return null;
    }
    
    private setLocalGroupsTerminalSession() {
        const localGroupsSession: LocalGroupTerminalSessions[] = [];
        
        this.groupsTerminalSessions.forEach((sessionGroup) => {
            localGroupsSession.push({
                index: sessionGroup.index,
                sessionIds: sessionGroup.sessions.map(p=> p.id)
            });
        })

        localStorage.setItem(LocalStorageKeys.TERMINAL_SESSIONS_GROUPS, JSON.stringify(localGroupsSession));
    }
}

export default new TerminalStore();
