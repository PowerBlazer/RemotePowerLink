/* eslint-disable indent */
import * as signalR from '@microsoft/signalr';
import { HostService } from 'app/services/hostService';
import { AuthorizationService } from 'app/services/AuthorizationService/authorizationService';
import { SftpFileList } from 'app/services/SftpService/config';
import { AppRoutes } from 'app/providers/router/config/routeConfig';
import { createHubInstance } from 'app/hubs/hubFactory';
import toast from 'react-hot-toast';
import { SftpNotificationData } from 'app/store/sftpStore';
import { HubConnectionState } from '@microsoft/signalr';

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

        this.events = (onFilesReceived, onDownloadReceived, onUploadReceived) => {
            this.connection.on('receivedFiles', (files: SftpFileList) => {
                onFilesReceived(files);
            });

            this.connection.on('downloadReceive', (sftpNotificationOptions: SftpNotificationData) => {
                onDownloadReceived(sftpNotificationOptions);
            })

            this.connection.on('handleError', (message: Record<string, string[]>) => {
                this.onError(message);
            });

            this.connection.on('uploadReceive', (sftpNotificationOptions: SftpNotificationData) => {
                onUploadReceived(sftpNotificationOptions)
            })
        };
    }

    public events: (
        onFilesReceived: (files: SftpFileList) => void,
        onDownloadReceived: (sftpNotificationOptions: SftpNotificationData) => void,
        onUploadReceived: (sftpNotificationOptions: SftpNotificationData) => void
    ) => void;

    public onConnect: () => Promise<void> = async function connect () { };
    public onError: (message: Record<string, string[]>) => void

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

export enum ConnectionState {
    Connected = 'Connected',
    Disconnected = 'Disconnected',
    Reconnecting = 'Reconnecting'
}

export default SftpHub;
