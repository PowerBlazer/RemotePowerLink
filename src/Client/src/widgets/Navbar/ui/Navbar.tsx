import {classNames} from 'shared/lib/classNames/classNames';
import {NavbarSetting} from 'widgets/NavbarSetting';
import {NavbarItem} from 'features/NavbarItem';
import {useTranslation} from 'react-i18next';
import style from './Navbar.module.scss';

import ServerIcon from 'shared/assets/icons/navbar/server.svg';
import FolderIcon from 'shared/assets/icons/navbar/folder.svg';
import PersonalIcon from 'shared/assets/icons/navbar/personal.svg';
import {getAppRouteFromPath} from "app/providers/router";
import {AppRoutes} from "app/providers/router/config/routeConfig";

interface NavbarProps {
    className?: string
}

export function Navbar ({ className }: NavbarProps) {
    const { t } = useTranslation('translation');
    

    return (
        <div className={classNames(style.navbar, {}, [className])}>
            <NavbarSetting/>
            <div className={style.common_block}>
                <PersonalIcon width={22} height={22}/>
                <h2 className={style.personal}>{t('Personal')}</h2>
            </div>
            <div className={classNames(style.nav_items)}>
                <NavbarItem
                    icon={<ServerIcon width={'22px'} height={'22px'}/>}
                    label={t('Сервера')}
                    className={classNames(style.server)}
                    isSelected={getAppRouteFromPath(location.pathname) == AppRoutes.MAIN}
                    navigate={"/"}
                />
                <NavbarItem
                    icon={<FolderIcon width={'18px'} height={'18px'}/>}
                    label={t('SFTP')}
                    className={classNames(style.sftp)}
                />
                <NavbarItem
                    icon={<h1>{'{}'}</h1>}
                    label={t('Сниппеты')}
                    className={classNames(style.snippets)}
                />
            </div>
        </div>
    )
}



