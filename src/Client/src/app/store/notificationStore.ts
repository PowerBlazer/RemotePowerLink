import {makeAutoObservable, observable} from "mobx";
import {NotificationHub} from "app/hubs/notificationHub";

export interface SftpNotificationData {
    operationName: string,
    informationText?: string,
    isProgress?: boolean,
    progressPercent?: number
}

export interface SftpNotificationOptions {
    data: SftpNotificationData,
    onCancel?: () => void
}

class NotificationStore {
    constructor() {
        makeAutoObservable(this);
    }
    
    @observable public notificationHub: NotificationHub | null = null;
    @observable public downloadNotificationOptions: SftpNotificationOptions | null = null;
}

export default new NotificationStore();