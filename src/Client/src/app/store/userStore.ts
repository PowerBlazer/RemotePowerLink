import {makeAutoObservable, configure, observable} from 'mobx';
import {ProxyData} from "app/services/ProxyService/config/proxyConfig";
import {IdentityData} from "app/services/IdentityService/config/identityConfig";
import {UserData} from "app/services/UserService/config/userConfig";
import {ServerData} from "app/services/ServerService/config/serverConfig";

class UserStore {
    @observable public userProxies: ProxyData[] | null = null;
    @observable public userIdentities: IdentityData[] | null = null;
    @observable public userServers: ServerData[] | null = null;
    
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
        const existingProxyIndex = this.userProxies.findIndex(
            (s) => s.proxyId === proxy.proxyId
        );

        if (existingProxyIndex !== -1) {
            // Если прокси уже существует, обновляем его
            this.userProxies[existingProxyIndex] = proxy;

            this.userProxies = [
                ...this.userProxies,
            ]
        } else {
            // Иначе добавляем новый сервер в список
            this.userProxies = [
                ...this.userProxies,
                proxy
            ]
        }
    }

    setUserIdentity (identity: IdentityData){
        const existingIdentityIndex = this.userIdentities.findIndex(
            (s) => s.identityId === identity.identityId
        );

        if (existingIdentityIndex !== -1) {
            // Если прокси уже существует, обновляем его
            this.userIdentities[existingIdentityIndex] = identity;

            this.userIdentities = [
                ...this.userIdentities,
            ]
        } else {
            // Иначе добавляем новый сервер в список
            this.userIdentities = [
                ...this.userIdentities,
                identity
            ]
        }
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
        const existingServerIndex = this.userServers.findIndex(
            (s) => s.serverId === server.serverId
        );

        if (existingServerIndex !== -1) {
            // Если сервер уже существует, обновляем его
            this.userServers[existingServerIndex] = server;
            
            this.userServers = [
                ...this.userServers,
            ]
        } else {
            // Иначе добавляем новый сервер в список
            this.userServers = [
                ...this.userServers,
                server
            ]
        }
    }
}

export default new UserStore();
