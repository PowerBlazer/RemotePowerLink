import terminalStore, {GroupTerminalSessions, TerminalSession} from 'app/store/terminalStore';
import userStore from 'app/store/userStore';
import TerminalHub from 'app/hubs/terminalHub';
import { ConnectionState } from 'app/hubs/hubFactory';
import toast from 'react-hot-toast';
import { SessionInstanceData } from 'app/services/SessionService/config';
import { ServerData } from 'app/services/ServerService/config/serverConfig';
import { SessionService } from 'app/services/SessionService/sessionService';

export const useTerminal = () => {
    function getGroupTerminalSessions(index:number): GroupTerminalSessions {
        return terminalStore.getGroupSessionsByIndex(index);
    }
    
    async function initSessions (sessions: SessionInstanceData[]) {
        const mappedSessions = sessions.map(p => {
            const terminalSession: TerminalSession = {
                id: p.id,
                isLoad: false,
                isNew: false,
                host: userStore.userServers.find(x => x.serverId === p.serverId)
            }

            return terminalSession;
        });

        terminalStore.groupsTerminalSessions = [];
        terminalStore.terminalHub = new TerminalHub();
        terminalStore.terminalHub.events(
             (outputData) => {
                 const currentSession = terminalStore.getSessionBySessionId(outputData.sessionId);
                 
                 if (currentSession && outputData.data) {
                    currentSession.isLoad = false;
                    currentSession.onOutput?.(outputData.data);
                 }
            },
            (sessionId) => {
                const groupSession = terminalStore.getGroupSessionsBySessionId(sessionId);
                
                if(groupSession)
                    closeSession(sessionId, groupSession.index);
            }
        );
        
        terminalStore.terminalHub.onConnect = async () => {
            terminalStore.initializeGroupSessions(terminalStore.selectedMode, mappedSessions);
            terminalStore.isLoad = false;
            
            if(mappedSessions.length > 0) {
                terminalStore.groupsTerminalSessions.forEach(groupSession => {
                    if(groupSession.sessions?.length > 0) {
                        selectSession(groupSession.sessions[0], groupSession.index);
                    }
                })
            }
        }

        terminalStore.terminalHub.onError = (errors) => {
            terminalStore.isLoad = false;
            
            //Поправить обработку ошибок
            /*if (terminalStore.selectedSession) {
                terminalStore.selectedSession.errors = errors;
            }*/

            toast.error(Object.values(errors).join('\n'));
        }
    }

    async function openSession (serverData: ServerData, groupIndex: number, onClose?: () => void) {
        const groupSessions = getGroupTerminalSessions(groupIndex);
        
        // eslint-disable-next-line no-undef
        const uniqueId = generateUniqueNumber();
        const newSession: TerminalSession = {
            id: uniqueId,
            host: serverData,
            isLoad: true,
            isNew: true,
        };

        if (groupSessions.selectedSession && !groupSessions.selectedSession.isLoad) {
            await terminalStore.terminalHub.disactivateSession(groupSessions.selectedSession.id);
        }

        const countSessionForServer = groupSessions.sessions.filter(
            p => p.host.serverId === serverData.serverId
        )?.length ?? 0;

        newSession.name = countSessionForServer === 0
            ? serverData.title
            : `${serverData.title} (${countSessionForServer})`;
        
        
        groupSessions.sessions.push(newSession);
        groupSessions.selectedSession = newSession;

        if (onClose) {
            onClose()
        }

        const createdSessionResult = await SessionService.createSession({
            serverId: serverData.serverId
        });

        if (createdSessionResult.isSuccess) {
            const currentSession = groupSessions.sessions.find(
                p => p.id === uniqueId
            )

            currentSession.id = createdSessionResult.result.id;
            currentSession.isNew = false;

            if (groupSessions.selectedSession && !groupSessions.selectedSession.isLoad) {
                await terminalStore.terminalHub.disactivateSession(groupSessions.selectedSession.id);
            }

            groupSessions.selectedSession = currentSession;

           terminalStore.updateStorageGroupSessions();
        }

        if (!createdSessionResult.isSuccess) {
            if (groupSessions.selectedSession && groupSessions.selectedSession.id === uniqueId) {
                groupSessions.selectedSession = null;
            }
            
            groupSessions.sessions = groupSessions.sessions.filter(p => p.id !== uniqueId);

            toast.error(Object.values(createdSessionResult.errors).join('\n'));
        }
    }

    async function closeSession (sessionId: number, groupIndex: number) {
        const groupSessions = getGroupTerminalSessions(groupIndex);
        
        groupSessions.sessions = groupSessions.sessions.filter(p => p.id !== sessionId);

        if (groupSessions.selectedSession?.id === sessionId && groupSessions.sessions.length > 0) {
            groupSessions.selectedSession = groupSessions.sessions[0];
        }

        if (groupSessions.sessions.length === 0) {
            groupSessions.selectedSession = null;
        }

        if (terminalStore.terminalHub.getConnectionState() === ConnectionState.Connected) {
            await terminalStore.terminalHub.disconnectFromSession(sessionId);
        }

        terminalStore.updateStorageGroupSessions();
    }

    async function selectSession (session: TerminalSession, groupIndex: number) {
        const groupSessions = getGroupTerminalSessions(groupIndex);
        
        if (groupSessions.selectedSession?.id === session.id) {
            return;
        }

        if (groupSessions.selectedSession && !groupSessions.selectedSession.isLoad) {
            await terminalStore.terminalHub.disactivateSession(groupSessions.selectedSession.id);
        }
        
        groupSessions.selectedSession = session;
        groupSessions.selectedSession.isLoad = true;
    }

    return {
        initSessions,
        closeSession,
        selectSession,
        openSession,
        getGroupTerminalSessions
    }
}

export default useTerminal;
