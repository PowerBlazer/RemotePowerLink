import { makeObservable, observable } from 'mobx';
import { ReactNode } from 'react';

export abstract class GenericSidebarData<T> {
    isVisible: boolean;
    title?: string;
    data?: T

    protected constructor () {
        makeObservable(this, {
            isVisible: observable,
            title: observable
        });
    }
}

export abstract class SidebarData {
    isVisible: boolean;
    title?: string;
    sidebar?: SidebarState;

    protected constructor () {
        this.isVisible = false;
        this.title = null;
        this.sidebar = null;

        makeObservable(this, {
            isVisible: observable,
            title: observable
        });
    }
}

export interface SidebarState {
    name: string,
    element?: ReactNode
}
