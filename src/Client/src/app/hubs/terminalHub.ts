import {HostService} from "app/services/hostService";
import * as signalR from "@microsoft/signalr";
import {ConnectionState, createHubInstance} from "app/hubs/hubFactory";
import {AuthorizationService} from "app/services/AuthorizationService/authorizationService";
import toast from "react-hot-toast";
import {AppRoutes} from "app/providers/router/config/routeConfig";
import {HubConnectionState} from "@microsoft/signalr";

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

        this.events = (onSessionOutput) => {
            this.connection.on("SessionOutput", (data:string) => {
                onSessionOutput(data);
            })
        };
    }
    
    public events: (
        onSessionOutput:(data: string) => void
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



    public openSessionConnection = async (serverId: number) => {
        if(this.validateConnection()){
            await this.connection.send("openSessionConnection", serverId);
        }
    }

    public connectToSession = async (sessionId: number) => {
        if(this.validateConnection()){
            await this.connection.send("connectToSession", sessionId);
        }
    }

    public disactivateSession = async (sessionId: number) => {
        if(this.validateConnection()){
            await this.connection.send("disactivateSession", sessionId);
        }
    }

    public disconnectFromSession = async (sessionId: number) => {
        if(this.validateConnection()){
            await this.connection.send("disconnectFromSession", sessionId);
        }
    }

    public writeToSession = async (sessionId: number, command:string) => {
        if(this.validateConnection()){
            await this.connection.send("writeToSession", sessionId, command);
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