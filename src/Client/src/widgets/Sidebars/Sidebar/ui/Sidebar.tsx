import { classNames } from 'shared/lib/classNames/classNames';
import style from './Sidebar.module.scss';
import { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared/ui/Button/Button';
import ArrowRight from 'shared/assets/icons/arrow-right.svg';
import sidebarStore from 'app/store/sidebarStore';
import { Loader } from 'shared/ui/Loader/Loader';

export interface SidebarOptions<T> {
    isMain?: boolean,
    onSave?: (data?: T) => Promise<void>,
    onClose?: () => void,
    isVisible?: boolean
}

interface SidebarProps {
    className?: string;
    children?: ReactNode;
    sidebars?: ReactNode;
    footer?: ReactNode;
    close?: () => Promise<void>;
    headerName?: string;
    headerTools?: ReactNode;
    isLoad?: boolean,
    isMain?: boolean,
}

function Sidebar (props: SidebarProps) {
    const {
        className,
        close,
        children,
        headerName,
        headerTools,
        footer,
        isMain,
        isLoad,
        sidebars
    } = props;

    const { t } = useTranslation('translation');

    const closeSidebarHandler = async () => {
        if (close && !isMain) {
            await close();
            return;
        }

        if (isMain) {
            await sidebarStore.setVisible(sidebarStore.mainSidebar, false);
            await sidebarStore.setSidebar(sidebarStore.mainSidebar, null);
        }
    }
    return (
        <div className={classNames(style.sidebar, {
            [style.main]: Boolean(isMain),
            [style.main_active]: Boolean(sidebarStore.mainSidebar.isVisible && isMain)
        }, [className])}>
            {headerName && (
                <div className={classNames(style.header)}>
                    <h1 className={classNames(style.header_name)}>
                        {t(headerName)}
                    </h1>
                    <div className={classNames(style.buttons_panel)}>
                        {headerTools}
                        <Button onClick={closeSidebarHandler} className={classNames(style.close_sidebar)}>
                            <ArrowRight width={20} height={20}></ArrowRight>
                        </Button>
                        {isLoad && <Loader className={classNames(style.loader)}/>}
                    </div>
                </div>
            )}
            <div className={classNames(style.sidebars)}>
                {sidebars}
            </div>
            <div className={classNames(style.content_block, {}, [])}>
                <div className={classNames(style.content)}>
                    <div className={classNames(style.content_inner)}>
                        {children}
                    </div>
                    {footer}
                </div>

            </div>
        </div>
    );
}

export default observer(Sidebar);
