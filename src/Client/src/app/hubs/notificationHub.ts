import {HostService} from "app/services/hostService";
import * as signalR from "@microsoft/signalr";
import {createHubInstance} from "app/hubs/hubFactory";
import {AuthorizationService} from "app/services/AuthorizationService/authorizationService";
import toast from "react-hot-toast";
import {AppRoutes} from "app/providers/router/config/routeConfig";
import {SftpNotificationData} from "app/store/notificationStore";

const URL = `${HostService._hubHost}/notification`;

export class NotificationHub {
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

        this.events = (onDownloadReceived) => {
            this.connection.on("downloadReceive", (sftpNotificationOptions: SftpNotificationData) => {
                onDownloadReceived(sftpNotificationOptions);
            })
            
            this.connection.on('handleError', (message: string) => {
                this.onError(message);
            })
        };
    }

    public events: (
       onDownloadReceived: (sftpNotificationOptions: SftpNotificationData) => void
    ) => void;

    public onConnect: () => Promise<void> = async function connect () { };
    public onError: (message: any) => void =
        function error (message) {
            toast.error(message);
        }

    public closeConnection = () => {
        this.connection.stop()
    }
    
    private validateConnection (): boolean {
        if (this.connection.state === 'Disconnected') {
            this.onError('Подключение прервано, переподключитесь или обновите страницу')
            return false;
        }

        if (this.connection.state === 'Reconnecting') {
            this.onError('Идет переподключение')
            return false;
        }

        return true;
    }
}

export default NotificationHub;