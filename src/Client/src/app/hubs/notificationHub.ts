export class NotificationHub {
    public events: () => void;
    public onConnect: () => Promise<void> = async function connect () { };
    public onError: (message: any) => void;
    public closeConnection = () => {}
}

export default NotificationHub;
