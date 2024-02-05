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
        // eslint-disable-next-line no-undef
        await delay(300);
    }

    async setSidebar (sideBar?: SidebarState) {
        if ((sideBar == null || this.mainSideBar == null) || sideBar?.name !== this.mainSideBar?.name) {
            this.isVisible = true;
            this.mainSideBar = sideBar;
            return;
        }

        if (sideBar?.name === this.mainSideBar?.name) {
            await this.setVisible(false);
            this.mainSideBar = null;
        }
    }
}

export default new SidebarStore();
