import { makeAutoObservable } from 'mobx';
import { MainSidebar } from 'app/store/sidebar/mainSidebar';
import { SftpSidebar } from 'app/store/sidebar/sftpSidebar';
import { SidebarData, SidebarState } from 'app/store/sidebar/sidebarData';

class SidebarStore {
    mainSidebar: MainSidebar;
    sftpSidebar: SftpSidebar;

    constructor () {
        this.mainSidebar = new MainSidebar();
        this.sftpSidebar = new SftpSidebar();

        makeAutoObservable(this);
    }

    resetVisibleSidebars (sidebarData: SidebarData) {
        Object.keys(sidebarData).forEach((key) => {
            const property = (sidebarData as any)[key];

            if (property && typeof property === 'object') {
                if ('isVisible' in property) {
                    property.isVisible = false;
                }
                this.resetVisibleSidebars(property);
            }
        });
    }

    async setVisible (sidebarData: SidebarData, value: boolean) {
        sidebarData.isVisible = value;
        await delay(200);
    }

    async setSidebar (sidebarData: SidebarData, sideBar?: SidebarState) {
        if (sidebarData?.sidebar == null && sideBar !== null) {
            sidebarData.isVisible = false;
            sidebarData.sidebar = sideBar;

            setTimeout(() => {
                sidebarData.isVisible = true;
            }, 0);

            return;
        }

        if ((sidebarData.sidebar !== null && sideBar !== null) && sidebarData.sidebar?.name !== sideBar?.name) {
            sidebarData.sidebar = sideBar;
            return;
        }

        if ((sidebarData.sidebar !== null && sideBar !== null) && sidebarData.sidebar?.name === sideBar?.name) {
            await this.setVisible(sidebarData, false);
            sidebarData.sidebar = undefined;
            this.resetVisibleSidebars(sidebarData);
            return;
        }

        if (sideBar === null) {
            sidebarData.isVisible = false
            sidebarData.sidebar = undefined;
            this.resetVisibleSidebars(sidebarData);
        }
    }
}

async function delay (ms: number) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

export default new SidebarStore();
