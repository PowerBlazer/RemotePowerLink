import { makeAutoObservable } from 'mobx';
import { ReactNode } from 'react';
import { ServerData } from 'app/services/ServerService/config/serverConfig';
import { ProxyData } from 'app/services/ProxyService/config/proxyConfig';
import { IdentityData } from 'app/services/IdentityService/config/identityConfig';

export interface SidebarOptions {
    isVisible: boolean;
    title?: string;
}

export interface SidebarState {
    name: string,
    sidebar?: ReactNode
}

export abstract class SidebarData implements SidebarOptions {
    isVisible: boolean;
}

export class SidebarNewHostData extends SidebarData {
}

export class SidebarNewProxyData extends SidebarData {
}

export class SidebarNewIdentityData extends SidebarData {
}

export class SidebarEditHostData extends SidebarData {
    server?: ServerData = null;
}

export class SidebarEditProxyData extends SidebarData {
    proxy?: ProxyData = null;
}

export class SidebarEditIdentityData extends SidebarData {
    identity?: IdentityData = null;
}

class SidebarStore {
    newHostData: SidebarNewHostData = { isVisible: false };
    newProxyData: SidebarNewProxyData = { isVisible: false };
    newIdentityData: SidebarNewIdentityData = { isVisible: false };

    editHostData: SidebarEditHostData = { isVisible: false };
    editProxyData: SidebarEditProxyData = { isVisible: false };
    editIdentityData: SidebarEditIdentityData = { isVisible: false };

    mainSideBar: SidebarState | null = null;
    isVisible: boolean = false;

    constructor () {
        makeAutoObservable(this);
    }

    resetVisibleSidebars () {
        const sidebarsData: SidebarData[] = [
            this.newHostData,
            this.newProxyData,
            this.newIdentityData,
            this.editHostData,
            this.editProxyData,
            this.editIdentityData
        ];

        sidebarsData.forEach(sidebarData => {
            sidebarData.isVisible = false;
        })
    }

    async setVisible (value: boolean) {
        this.isVisible = value;
        await delay(200);
    }

    async setSidebar (sideBar?: SidebarState) {
        if (this.mainSideBar == null && sideBar !== null) {
            this.isVisible = false;
            this.mainSideBar = sideBar;

            setTimeout(() => {
                this.isVisible = true;
            }, 0);

            return;
        }

        if ((this.mainSideBar !== null && sideBar !== null) && this.mainSideBar.name !== sideBar.name) {
            this.mainSideBar = sideBar;
            return;
        }

        if ((this.mainSideBar !== null && sideBar !== null) && this.mainSideBar.name === sideBar.name) {
            await this.setVisible(false);
            this.mainSideBar = null;
            this.resetVisibleSidebars();
            return;
        }

        if (sideBar === null) {
            this.isVisible = false
            this.mainSideBar = null;
            this.resetVisibleSidebars();
        }
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default new SidebarStore();
