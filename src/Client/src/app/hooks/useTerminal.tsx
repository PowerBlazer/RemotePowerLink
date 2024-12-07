import terminalStore, { TerminalSession } from 'app/store/terminalStore';
import userStore from 'app/store/userStore';
import TerminalHub from 'app/hubs/terminalHub';
import { ConnectionState } from 'app/hubs/hubFactory';
import toast from 'react-hot-toast';
import { SessionInstanceData } from 'app/services/SessionService/config';
import { ServerData } from 'app/services/ServerService/config/serverConfig';
import { SessionService } from 'app/services/SessionService/sessionService';

export const useTerminal = () => {
    async function initSessions (sessions: SessionInstanceData[]) {
        terminalStore.sessions = sessions.map(p => {
            const terminalSession: TerminalSession = {
                id: p.id,
                isLoad: false,
                isNew: false,
                isCreate: false,
                host: userStore.userServers.find(x => x.serverId === p.serverId)
            }

            return terminalSession;
        });

        terminalStore.terminalHub = new TerminalHub();
        terminalStore.terminalHub.events(
            (outputData) => {
                const currentSession = terminalStore.sessions.find(p => p.id === outputData.sessionId);

                if (currentSession && outputData.data) {
                    currentSession.isLoad = false;
                    currentSession.onOutput?.(outputData.data);
                }
            },
            (sessionId) => {
                closeSession(sessionId);
            }
        );

        terminalStore.terminalHub.onError = (errors) => {
            if (terminalStore.selectedSession) {
                terminalStore.selectedSession.errors = errors;
            }

            toast.error(Object.values(errors).join('\n'));
        }
    }

    async function openSession (serverData: ServerData, onClose?: () => void) {
        // eslint-disable-next-line no-undef
        const uniqueId = generateUniqueNumber();
        const newSession: TerminalSession = {
            id: uniqueId,
            host: serverData,
            isLoad: true,
            isNew: true,
            isCreate: true
        };

        if (terminalStore.selectedSession) {
            await terminalStore.terminalHub.disactivateSession(terminalStore.selectedSession.id);
        }

        const countSessionForServer = terminalStore.sessions
            .filter(p => p.host.serverId === serverData.serverId)?.length ?? 0;

        newSession.name = countSessionForServer === 0
            ? serverData.title
            : `${serverData.title} (${countSessionForServer})`;

        terminalStore.sessions.push(newSession);
        terminalStore.selectedSession = newSession;

        if (onClose) {
            onClose()
        }

        const createdSessionResult = await SessionService.createSession({
            serverId: serverData.serverId
        });

        if (createdSessionResult.isSuccess) {
            const currentSession = terminalStore.sessions.find(p => p.id === uniqueId)

            currentSession.id = createdSessionResult.result.id;
            currentSession.isNew = false;

            if (terminalStore.selectedSession && !terminalStore.selectedSession.isLoad) {
                await terminalStore.terminalHub.disactivateSession(terminalStore.selectedSession.id);
            }

            terminalStore.selectedSession = currentSession;
        }

        if (!createdSessionResult.isSuccess) {
            if (terminalStore.selectedSession && terminalStore.selectedSession.id === uniqueId) {
                terminalStore.selectedSession = null;
            }

            terminalStore.sessions = terminalStore.sessions.filter(p => p.id !== uniqueId);

            toast.error(Object.values(createdSessionResult.errors).join('\n'));
        }
    }

    async function closeSession (sessionId: number) {
        terminalStore.sessions = terminalStore.sessions.filter(p => p.id !== sessionId);

        if (terminalStore.selectedSession?.id === sessionId && terminalStore.sessions.length > 0) {
            if (terminalStore.sessions[0].isCreate) {
                terminalStore.sessions[0].isCreate = false;
            }
            terminalStore.selectedSession = terminalStore.sessions[0];
        }

        if (terminalStore.sessions.length === 0) {
            terminalStore.selectedSession = null;
        }

        if (terminalStore.terminalHub.getConnectionState() === ConnectionState.Connected) {
            await terminalStore.terminalHub.disconnectFromSession(sessionId);
        }
    }

    async function selectSession (session: TerminalSession) {
        if (terminalStore.selectedSession?.id === session.id) {
            return;
        }

        if (terminalStore.selectedSession && !terminalStore.selectedSession.isLoad) {
            await terminalStore.terminalHub.disactivateSession(terminalStore.selectedSession.id);
        }

        session.isCreate = false;
        terminalStore.selectedSession = session;
        terminalStore.selectedSession.isLoad = true;
    }

    return {
        initSessions,
        closeSession,
        selectSession,
        openSession
    }
}

export default useTerminal;
