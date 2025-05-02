import { HostService } from 'app/services/hostService';
import * as signalR from '@microsoft/signalr';
import { ConnectionState, createHubInstance } from 'app/hubs/hubFactory';
import { AuthorizationService } from 'app/services/AuthorizationService/authorizationService';
import toast from 'react-hot-toast';
import { AppRoutes } from 'app/providers/router/config/routeConfig';
import { HubConnectionState } from '@microsoft/signalr';
import { TerminalOutputData } from 'app/store/terminalStore';

const URL = `${HostService._hubHost}/terminal`;

class TerminalHub {
    private connection: signalR.HubConnection;
    constructor () {
        this.connection = createHubInstance(URL);

        this.connection.start()
            .then(async () => { await this.onConnect(); })
            .catch(async err => {
                if (err.message?.includes('401')) {
                    const refreshResult = await AuthorizationService.refreshToken();
                    if (refreshResult.isSuccess) {
                        this.connection = createHubInstance(URL);
                        this.connection.start()
                            .then(async () => { await this.onConnect(); })
                            .catch(err => toast.error(err.toString()));
                    }

                    if (!refreshResult.isSuccess) {
                        location.pathname = AppRoutes.LOGIN.toString();
                    }

                    return;
                }

                this.onError(err.toString())
            });

        this.events = (onSessionOutput, onDisconnect) => {
            this.connection.on('SessionOutput', (outputData: TerminalOutputData) => {
                onSessionOutput(outputData);
            });

            this.connection.on('SessionDisconected', (sessionId: number) => {
                onDisconnect(sessionId);
            });

            this.connection.on('HandleError', (message: Record<string, string[]>) => {
                this.onError(message);
            });
        };
    }

    public events: (
        onSessionOutput: (outputData: TerminalOutputData) => void,
        onDisconnect: (sessionId: number) => void,
    ) => void;

    public onConnect: () => Promise<void> = async function connect () { };
    public onError: (message: Record<string, string[]>) => void;

    public closeConnection = async () => {
        await this.connection.stop()
    }

    public getConnectionState = () => {
        switch (this.connection.state) {
            case HubConnectionState.Connected:
                return ConnectionState.Connected;
            case HubConnectionState.Disconnected:
                return ConnectionState.Disconnected;
            case HubConnectionState.Reconnecting:
                return ConnectionState.Reconnecting;
            default:
                return null
        }
    }

    public getConnectionId = () => {
        return this.connection.connectionId;
    }

    public disactivateSession = async (sessionId: number) => {
        if (this.validateConnection()) {
            await this.connection.send('disactivateSession', sessionId);
        }
    }

    public activateSession = async (sessionId: number) => {
        if (this.validateConnection()) {
            await this.connection.send('activateSession', sessionId);
        }
    }

    public disconnectFromSession = async (sessionId: number) => {
        if (this.validateConnection()) {
            await this.connection.send('disconnectFromSession', sessionId);
        }
    }

    public writeToSession = async (sessionId: number, command: string) => {
        if (this.validateConnection()) {
            await this.connection.send('writeToSession', sessionId, command);
        }
    }

    private validateConnection (): boolean {
        if (this.connection.state === 'Disconnected') {
            this.onError({
                Server: ['Подключение прервано, переподключитесь или обновите страницу']
            })

            return false;
        }

        if (this.connection.state === 'Reconnecting') {
            this.onError({
                Server: ['Идет переподключение']
            })

            return false;
        }

        return true;
    }
}

export default TerminalHub;
