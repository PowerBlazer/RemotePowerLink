import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarNewIdentity.module.scss';
import { observer } from 'mobx-react-lite';
import { Sidebar, SidebarOptions } from 'widgets/Sidebar';
import sidebarStore from "app/store/sidebarStore";
import {CreateIdentityResult} from "services/IdentityService/config/identityConfig";

interface SidebarNewIdentityProps extends SidebarOptions<CreateIdentityResult> {
    className?: string;
}

function SidebarNewIdentity ({ className, isMain = true }: SidebarNewIdentityProps) {
    const closeHandler = async () => {
        if(!isMain){
            sidebarStore.newIdentityData.isVisible = false;
        }
    }
    
    return (
        <Sidebar
            className={classNames(style.sidebarNewProxy, {
                [style.active]: (sidebarStore.newIdentityData?.isVisible)
            }, [className])}
            isMain={isMain}
            headerName={'Новый иденитификатор'}
            close={closeHandler}
        >
            asdas
        </Sidebar>
    );
}

export default observer(SidebarNewIdentity)
