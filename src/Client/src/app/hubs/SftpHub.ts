import * as signalR from '@microsoft/signalr';
import { HostService } from 'app/services/hostService';
import { AuthorizationService } from 'app/services/AuthorizationService/authorizationService';
import toast from 'react-hot-toast';
import { SftpFileList } from 'app/services/SftpService/config/sftpConfig';
import { AppRoutes } from 'app/providers/router/config/routeConfig';

const URL = `${HostService._apiHost}/sftp`;
class SftpHub {
    private connection: signalR.HubConnection;
    constructor () {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL, {
                accessTokenFactory: () => AuthorizationService.getAccessToken()
            })
            .withAutomaticReconnect()
            .build();

        this.connection.start()
            .then(async () => { await this.onConnect(); })
            .catch(async err => {
                if (err.message && err.message.includes('401')) {
                    const refreshResult = await AuthorizationService.refreshToken();

                    if (refreshResult.isSuccess) {
                        this.connection = new signalR.HubConnectionBuilder()
                            .withUrl(URL, {
                                accessTokenFactory: () => AuthorizationService.getAccessToken()
                            })
                            .withAutomaticReconnect()
                            .build();

                        this.connection.start()
                            .then(async () => { await this.onConnect(); })
                            .catch(err => toast.error(err.toString()));
                    }

                    if (!refreshResult.isSuccess) {
                        location.pathname = AppRoutes.LOGIN.toString();
                    }

                    return;
                }

                toast.error(err.toString());
            });

        this.events = (onFilesReceived) => {
            this.connection.on('receivedFiles', (files: SftpFileList) => {
                onFilesReceived(files);
            });

            this.connection.on('handleError', (message: string) => {
                this.onError(message);
            })
        };
    }

    public events: (
        onFilesReceived: (files: SftpFileList) => void,
    ) => void;

    public onConnect: () => Promise<void> = async function connect () { };
    public onError: (message: string) => void =
        function error (message) {
            toast.error(message);
        }

    public closeConnection = () => {
        this.connection.stop()
    }

    public getFilesServer = async (serverId: number, path?: string) => {
        await this.connection.send('getFilesServer', serverId, path);
    }
}
export default SftpHub;
