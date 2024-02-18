import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarNewProxy.module.scss';
import { observer } from 'mobx-react-lite';
import { Sidebar, SidebarOptions } from 'widgets/Sidebar';
import sidebarStore from "app/store/sidebarStore";
import {Button} from "shared/ui/Button/Button";

interface SidebarNewProxyProps extends SidebarOptions {
    className?: string;
}

function SidebarNewProxy ({ className, isMain = true }: SidebarNewProxyProps) {
    const closeHandler = async () => {
        if(!isMain){
            sidebarStore.newProxyData.isVisible = false;
        }
    }
    
    return (
        <Sidebar
            className={classNames(style.sidebarNewProxy, {
                [style.active]: (sidebarStore.newProxyData?.isVisible && !isMain),
            }, [className])}
            isMain={isMain}
            headerName={'Новый прокси'}
            close={closeHandler}
        >
            dfdsf
        </Sidebar>
    );
}

export default observer(SidebarNewProxy);
