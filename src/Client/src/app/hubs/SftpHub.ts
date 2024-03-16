import * as signalR from "@microsoft/signalr";
import {HostService} from "../services/hostService";
import toast from "react-hot-toast";
import {AuthorizationService} from "app/services/AuthorizationService/authorizationService";

const URL = `${HostService._apiHost}/sftp`;
class SftpHub {
    private connection: signalR.HubConnection;
    
    public events: (
        onMessageReceived: (files:any) => void,
        
    ) => void;
    
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL,{
                accessTokenFactory: () => {
                    return AuthorizationService.getAccessToken();
                },
            })
            .withAutomaticReconnect()
            .build();
        
        this.connection
            .start()
            .catch(err => toast.error(err.toString()));
        
        this.events = (onMessageReceived) => {
            this.connection.on("receivedFiles", (files) => {
                onMessageReceived(files);
            });
        };
    }
    public test = (path:string) => {
        this.connection.send("getFilesServer", 27, path).then(x => console.log("sent"))
    }
}
export default SftpHub;