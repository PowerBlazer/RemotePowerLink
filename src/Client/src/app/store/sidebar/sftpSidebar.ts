import { makeObservable, observable } from 'mobx';
import { SidebarData, SidebarState } from 'app/store/sidebar/sidebarData';

export class SftpSidebar extends SidebarData {
    sidebar?: SidebarState;

    constructor () {
        super();
        makeObservable(this, {
            sidebar: observable
        });
    }
}
