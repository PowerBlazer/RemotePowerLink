import {makeAutoObservable, observable} from "mobx";
import {NotificationHub} from "app/hubs/notificationHub";

export interface SftpNotificationOptions {
    operationName: string,
    informationText?: string,
    isProgress?: boolean,
    isLoad?: boolean
}


class NotificationStore {
    constructor() {
        makeAutoObservable(this);
    }
    
    @observable public notificationHub: NotificationHub | null = null;
    @observable public downloadNotificationOptions: SftpNotificationOptions | null = null;
    
}