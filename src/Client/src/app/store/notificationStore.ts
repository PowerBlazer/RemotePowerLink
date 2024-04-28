import {makeAutoObservable, observable} from "mobx";
import {NotificationHub} from "app/hubs/notificationHub";



class NotificationStore {
    constructor() {
        makeAutoObservable(this);
    }
}

export default new NotificationStore();