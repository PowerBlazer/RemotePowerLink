import { makeAutoObservable, configure } from 'mobx';
import {ProxyData} from "services/ProxyService/config/proxyConfig";
import {IdentityData} from "services/IdentityService/config/identityConfig";
import {UserData} from "services/UserService/config/userConfig";
import {ServerData} from "services/ServerService/config/serverConfig";

class UserStore {
    public userProxies: ProxyData[] | null = null;
    public userIdentities: IdentityData[] | null = null;
    public userServers: ServerData[] | null = null;
    
    public userData: UserData | null = null;
    public isLoadData: boolean = false;
    
    constructor () {
        makeAutoObservable(this);

        configure({
            enforceActions: 'never'
        })
    }
    
    setLoad(isLoad: boolean){
        this.isLoadData = isLoad;
    }

    setUserData (userData: UserData) {
        this.userData = userData;
    }
    
    setUserProxies (proxies: ProxyData[]){
        if(!this.userProxies){
            this.userProxies = proxies;
            return;
        }
        
        this.userProxies = [
            ...this.userProxies,
            ...proxies
        ]
    }
    
    setUserIdentities (identities: IdentityData[]){
        if(!this.userIdentities){
            this.userIdentities = identities;
            return;
        }
        
        this.userIdentities = [
            ...this.userIdentities,
            ...identities
        ]
    }

    setUserProxy (proxy: ProxyData){
        if(!this.userProxies){
            this.userProxies = [proxy];
            return;
        }
        
        this.userProxies = [
            ...this.userProxies,
            proxy
        ]
    }

    setUserIdentity (identity: IdentityData){
        if(!this.userIdentities){
            this.userIdentities = [identity];
            return;
        }
        
        this.userIdentities = [
            ...this.userIdentities,
            identity
        ]
    }
    
    setUserServers (servers: ServerData[]){
        if(!this.userServers){
            this.userServers = servers;
            return;
        }
        
        this.userServers = [
            ...this.userServers,
            ...servers
        ];
    }
    
    setUserServer (server: ServerData){
        if(!this.userServers){
            this.userServers = [server];
            return
        }
        
        this.userServers = [
            ...this.userServers,
            server
        ];
    }
}

export default new UserStore();
