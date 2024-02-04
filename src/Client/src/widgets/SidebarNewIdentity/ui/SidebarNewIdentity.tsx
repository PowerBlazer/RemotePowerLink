import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarNewIdentity.module.scss';
import {observer} from "mobx-react-lite";
import {Sidebar, SidebarOptions} from "widgets/Sidebar";

interface SidebarNewIdentityProps extends SidebarOptions{
    className?: string;
}

function SidebarNewIdentity ({ className, isMain = true }: SidebarNewIdentityProps) {
    return (
        <Sidebar
            className={classNames(style.sidebarNewProxy,{},[className])}
            isMain={isMain}
            headerName={"Новый иденитификатор"}
        >

        </Sidebar>
    );
}


export default observer(SidebarNewIdentity)