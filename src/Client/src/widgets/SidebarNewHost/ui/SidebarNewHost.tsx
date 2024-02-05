import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarNewHost.module.scss';
import { observer } from 'mobx-react-lite';
import { Sidebar } from 'widgets/Sidebar';

interface SidebarNewHostProps {
    className?: string;
    isMain?: boolean;
}

function SidebarNewHost ({ className, isMain = false }: SidebarNewHostProps) {
    return (
        <Sidebar
            className={classNames(style.sidebarNewHost, {}, [className])}
            isMain={isMain}
            headerName={'Новый сервер'}
        >

        </Sidebar>
    );
}

export default observer(SidebarNewHost)
