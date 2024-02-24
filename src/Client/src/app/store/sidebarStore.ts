import { makeAutoObservable } from 'mobx';
import { ReactNode } from 'react';
import {ProxyData} from "services/ProxyService/config/proxyConfig";
import {IdentityData} from "services/IdentityService/config/identityConfig";

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
    proxies?: ProxyData[] | null = null;
    identities?: IdentityData[] | null = null;
}

export class SidebarNewProxyData extends SidebarData {
    identities?: IdentityData[] | null = null;
}

export class SidebarNewIdentityData extends SidebarData {
    
}

class SidebarStore {
    newHostData: SidebarNewHostData  = { isVisible: false };
    newProxyData: SidebarNewProxyData = { isVisible: false };
    newIdentityData: SidebarNewIdentityData = { isVisible: false };

    mainSideBar: SidebarState | null = null;
    isVisible: boolean = false;

    constructor () {
        makeAutoObservable(this);
    }

    resetVisibleSidebars(){
        const sidebarsData: SidebarData[] = [
            this.newHostData,
            this.newProxyData,
            this.newIdentityData
        ];

        sidebarsData.forEach(sidebarData=>{
            sidebarData.isVisible = false;
        })
    }

    async setVisible (value: boolean) {
        this.isVisible = value;
        await delay(200);
    }

    async setSidebar (sideBar?: SidebarState) {
        if(this.mainSideBar == null && sideBar !== null){
            this.isVisible = false;
            this.mainSideBar = sideBar;
            
            setTimeout(()=>{
                this.isVisible = true;
            },0);
            
            return;
        }
        
        if((this.mainSideBar !== null && sideBar !== null) && this.mainSideBar.name !== sideBar.name){
            this.mainSideBar = sideBar;
            return;
        }
        
        if((this.mainSideBar !== null && sideBar !== null) && this.mainSideBar.name === sideBar.name){
            await this.setVisible(false);
            this.mainSideBar = null;
            this.resetVisibleSidebars();
            return;
        }
        
        if(sideBar === null){
            this.isVisible = false
            this.mainSideBar = null;
            this.resetVisibleSidebars();
            return;
        }
    }
}

export default new SidebarStore();
