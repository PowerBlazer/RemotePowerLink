import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarNewProxy.module.scss';
import {observer} from "mobx-react-lite";
import {Sidebar, SidebarOptions} from "widgets/Sidebar";

interface SidebarNewProxyProps extends SidebarOptions{
    className?: string;
}

function SidebarNewProxy ({ className, isMain = true }: SidebarNewProxyProps) {
    return (
        <Sidebar 
            className={classNames(style.sidebarNewProxy,{},[className])} 
            isMain={isMain}
            headerName={"Новый прокси"}
        >
            
        </Sidebar>
    );
}

export default observer(SidebarNewProxy);