import * as signalR from '@microsoft/signalr';
import { HostService } from 'app/services/hostService';
import { AuthorizationService } from 'app/services/AuthorizationService/authorizationService';
import { SftpFileList } from 'app/services/SftpService/config';
import { AppRoutes } from 'app/providers/router/config/routeConfig';
import {createHubInstance} from "app/hubs/hubFactory";
import toast from 'react-hot-toast';

const URL = `${HostService._hubHost}/sftp`;
class SftpHub {
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

        this.events = (onFilesReceived) => {
            this.connection.on('receivedFiles', (files: SftpFileList) => {
                onFilesReceived(files);
            });

            this.connection.on('handleError', (message: Record<string, string[]>) => {
                this.onError(message);
            })
        };
    }

    public events: (
        onFilesReceived: (files: SftpFileList) => void,
    ) => void;

    public onConnect: () => Promise<void> = async function connect () { };
    public onError: (message: Record<string, string[]>) => void 

    public closeConnection = () => {
        this.connection.stop()
    }

    public getFilesServer = async (serverId: number, path?: string) => {
        if (this.validateConnection()) {
            await this.connection.send('getFilesServer', serverId, path);
        }
    }
    
    public getConnectionId = () => {
        return this.connection.connectionId;
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
export default SftpHub;
