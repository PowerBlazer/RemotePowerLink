import { ServerData } from 'app/services/ServerService/config/serverConfig';
import { ProxyData } from 'app/services/ProxyService/config/proxyConfig';
import { IdentityData } from 'app/services/IdentityService/config/identityConfig';
import { makeObservable, observable } from 'mobx';
import { GenericSidebarData, SidebarData, SidebarState } from 'app/store/sidebar/sidebarData';

export class MainSidebar extends SidebarData {
    newHostData: SidebarData = { isVisible: false };
    newProxyData: SidebarData = { isVisible: false };
    newIdentityData: SidebarData = { isVisible: false };

    editHostData: GenericSidebarData<ServerData> = { isVisible: false };
    editProxyData: GenericSidebarData<ProxyData> = { isVisible: false };
    editIdentityData: GenericSidebarData<IdentityData> = { isVisible: false };

    sidebar?: SidebarState;

    constructor () {
        super();
        makeObservable(this, {
            newHostData: observable,
            newProxyData: observable,
            newIdentityData: observable,
            editHostData: observable,
            editProxyData: observable,
            editIdentityData: observable,
            sidebar: observable
        });
    }
}
