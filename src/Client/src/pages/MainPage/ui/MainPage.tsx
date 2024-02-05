
import { useTranslation } from 'react-i18next';

import { classNames } from 'shared/lib/classNames/classNames';
import style from './MainPage.module.scss';
import { NavbarHosts } from 'widgets/NavbarHosts';
import { observer } from 'mobx-react-lite';
import sidebarStore from 'app/store/sidebarStore';

function MainPage () {
    const { t } = useTranslation();

    return (
        <div className={classNames(style.main_page)}>
            <div className={classNames(style.content)}>
                <NavbarHosts/>
            </div>
            {sidebarStore.mainSideBar?.sidebar}
        </div>
    );
}

export default observer(MainPage);
