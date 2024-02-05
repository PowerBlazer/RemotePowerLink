import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarNewHost.module.scss';
import { observer } from 'mobx-react-lite';
import { Sidebar } from 'widgets/Sidebar';
import {FormBlock} from "features/FormBlock";
import ServerIcon from 'shared/assets/icons/navbar/server2.svg';

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
            <FormBlock headerName={'Address'}>
                <div className={classNames(style.address_block)}>
                    <div className={classNames(style.icon_server)}>
                        <ServerIcon width={27} height={27}/>
                    </div>
                    
                </div>
            </FormBlock>
        </Sidebar>
    );
}

export default observer(SidebarNewHost)
