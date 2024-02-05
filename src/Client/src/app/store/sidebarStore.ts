import { makeAutoObservable } from 'mobx';
import { ReactNode } from 'react';

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

class SidebarStore {
    newHostData: SidebarNewHostData | null = null;
    newProxyData: SidebarNewProxyData | null = null;

    mainSideBar: SidebarState | null = null;
    isVisible: boolean = false;

    constructor () {
        makeAutoObservable(this);
    }

    setData (data: SidebarData) {
        if (data instanceof SidebarNewHostData) {
            this.newHostData = data;
        }

        if (data instanceof SidebarNewProxyData) {
            this.newProxyData = data;
        }
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
            return;
        }
        
        if(sideBar === null){
            this.isVisible = false
            this.mainSideBar = null;
            return;
        }
    }
}

export default new SidebarStore();
