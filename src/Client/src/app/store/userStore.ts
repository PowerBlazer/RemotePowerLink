import { makeAutoObservable, configure, observable } from 'mobx';
import { ProxyData } from 'app/services/ProxyService/config/proxyConfig';
import { IdentityData } from 'app/services/IdentityService/config/identityConfig';
import { UserData } from 'app/services/UserService/config';
import { ServerData } from 'app/services/ServerService/config/serverConfig';
import { EncodingData } from 'app/services/EncodingService/config';

export interface SettingsModalOption {
    passwordState: boolean,
    usernameState: boolean,
    phoneNumberState: boolean,
    emailState: boolean
}

class UserStore {
    @observable public userProxies: ProxyData[] | null = null;
    @observable public userIdentities: IdentityData[] | null = null;
    @observable public userServers: ServerData[] | null = null;
    @observable public encodings: EncodingData[] | null = null;

    public userData: UserData | null = null;
    public isLoadData: boolean = false;
    public location: string = document.location.pathname.replace('/', '');

    public settingsModalOptions: SettingsModalOption = {
        passwordState: false,
        usernameState: false,
        phoneNumberState: false,
        emailState: false
    }

    constructor () {
        makeAutoObservable(this);

        configure({
            enforceActions: 'never'
        })
    }

    setLoad (isLoad: boolean) {
        this.isLoadData = isLoad;
    }

    setUserData (userData: UserData) {
        this.userData = userData;
    }

    setUserEncodings (encodings: EncodingData[]) {
        this.encodings = encodings;
    }

    setUserProxies (proxies: ProxyData[]) {
        if (!this.userProxies) {
            this.userProxies = proxies;
            return;
        }

        this.userProxies = [
            ...this.userProxies,
            ...proxies
        ]
    }

    setUserIdentities (identities: IdentityData[]) {
        if (!this.userIdentities) {
            this.userIdentities = identities;
            return;
        }

        this.userIdentities = [
            ...this.userIdentities,
            ...identities
        ]
    }

    setUserProxy (proxy: ProxyData) {
        if (this.userProxies) {
            const existingProxyIndex = this.userProxies.findIndex(
                (s) => s.proxyId === proxy.proxyId
            );

            if (existingProxyIndex !== -1) {
                // Если прокси уже существует, обновляем его
                this.userProxies[existingProxyIndex] = proxy;

                this.userProxies = [
                    ...this.userProxies
                ]
            } else {
                // Иначе добавляем новый прокси в список

                this.userProxies = [
                    ...this.userProxies,
                    proxy
                ]
            }
        }
    }

    setUserIdentity (identity: IdentityData) {
        if (this.userIdentities) {
            const existingIdentityIndex = this.userIdentities.findIndex(
                (s) => s.identityId === identity.identityId
            );

            if (existingIdentityIndex !== -1) {
                // Если прокси уже существует, обновляем его
                this.userIdentities[existingIdentityIndex] = identity;

                this.userIdentities = [
                    ...this.userIdentities
                ]
            } else {
                // Иначе добавляем новый сервер в список
                this.userIdentities = [
                    ...this.userIdentities,
                    identity
                ]
            }
        }
    }

    setUserServers (servers: ServerData[]) {
        if (!this.userServers) {
            this.userServers = servers;
            return;
        }

        this.userServers = [
            ...this.userServers,
            ...servers
        ];
    }

    setUserServer (server: ServerData) {
        if (this.userServers) {
            const existingServerIndex = this.userServers.findIndex(
                (s) => s.serverId === server.serverId
            );

            if (existingServerIndex !== -1) {
                // Если сервер уже существует, обновляем его
                this.userServers[existingServerIndex] = server;

                this.userServers = [
                    ...this.userServers
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

    removeUserProxy (proxyId: number) {
        if (this.userProxies) {
            this.userProxies = this.userProxies
                .filter(proxy => proxy.proxyId !== proxyId);

            const serversInProxy = this.userServers?.filter(p => p.proxyId === proxyId);

            serversInProxy?.forEach(server => {
                server.proxyId = undefined;
            })
        }
    }

    removeUserIdentity (identityId: number) {
        if (this.userIdentities && this.userServers && this.userProxies) {
            const serversInIdentity = this.userServers
                .filter(p => p.identityId === identityId)
                .map(p => p.serverId);

            const proxiesInIdentity = this.userProxies
                .filter(p => p.identityId === identityId)
                .map(p => p.proxyId);

            this.userIdentities = this.userIdentities
                .filter(identity => identity.identityId !== identityId);

            this.userServers = this.userServers.filter(p => !serversInIdentity.includes(p.serverId));
            this.userProxies = this.userProxies.filter(p => !proxiesInIdentity.includes(p.proxyId));
        }
    }

    removeUserServer (serverId: number) {
        if (this.userServers) {
            this.userServers = this.userServers
                .filter(server => server.serverId !== serverId);
        }
    }
}

export default new UserStore();
