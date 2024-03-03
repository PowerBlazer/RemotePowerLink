import { makeAutoObservable, configure } from 'mobx';
import {ProxyData} from "services/ProxyService/config/proxyConfig";
import {IdentityData} from "services/IdentityService/config/identityConfig";
import {UserData} from "services/UserService/config/userConfig";

class UserStore {
    public userProxies: ProxyData[] | null;
    public userIdentities: IdentityData[] | null;
    public userData: UserData | null;
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
}

export default new UserStore();
