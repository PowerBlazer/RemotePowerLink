import { classNames } from 'shared/lib/classNames/classNames';
import style from './Sidebar.module.scss';
import { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared/ui/Button/Button';
import ArrowRight from 'shared/assets/icons/arrow-right.svg';
import sidebarStore from 'app/store/sidebarStore';
import {Loader} from "shared/ui/Loader/Loader";

export interface SidebarOptions<T> {
    isMain?: boolean,
    onSave?: (data: T) => Promise<void>
}

interface SidebarProps{
    className?: string;
    children?: ReactNode;
    sidebars?: ReactNode
    close?: () => Promise<void>;
    headerName?: string;
    headerChildren?: ReactNode;
    isLoad? : boolean,
    isMain?: boolean,
}

function Sidebar ({
        className,
        close,
        children,
        headerName,
        headerChildren,
        isMain,
        isLoad,
        sidebars
    }: SidebarProps) {
    const { t } = useTranslation('translation');

    const closeSidebarHandler = async () => {
        if (close && !isMain) {
            await close();
            return;
        }
        
        if (isMain) {
            await sidebarStore.setVisible(false);
            await sidebarStore.setSidebar(null);
        }
    }
    return (
        <div className={classNames(style.sidebar, {
            [style.main]: isMain,
            [style.main_active]: sidebarStore.isVisible && isMain,
        }, [className])}>
            {headerName && (
                <div className={classNames(style.header)}>
                    <h1 className={classNames(style.header_name)}>{t(headerName)}</h1>
                    <div className={classNames(style.buttons_panel)}>
                        {headerChildren}
                        {isLoad && <Loader className={classNames(style.loader)}/>}
                        <Button onClick={closeSidebarHandler} className={classNames(style.close_sidebar)}>
                            <ArrowRight width={20} height={20}></ArrowRight>
                        </Button>
                    </div>
                </div>
            )}
            <div className={classNames(style.sidebars)}>
                {sidebars}
            </div>
            <div className={classNames(style.content,{},[])}>
                {children}
            </div>
        </div>
    );
}

export default observer(Sidebar);
