import { classNames } from 'shared/lib/classNames/classNames';
import style from './MainPage.module.scss';
import { NavbarHosts } from 'widgets/NavbarHosts';
import { observer } from 'mobx-react-lite';
import sidebarStore from 'app/store/sidebarStore';
import {ServerManagerCatalog} from "widgets/ServerManagerCatalog";

function MainPage () {
    return (
        <div className={classNames(style.main_page)}>
            <div className={classNames(style.content)}>
                <NavbarHosts/>
                <ServerManagerCatalog/>
            </div>
            {sidebarStore.mainSideBar?.sidebar}
        </div>
    );
}

export default observer(MainPage);
