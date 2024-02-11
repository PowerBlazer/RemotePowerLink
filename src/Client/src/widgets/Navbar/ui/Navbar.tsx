import { classNames } from 'shared/lib/classNames/classNames';
import { NavbarSetting } from 'widgets/NavbarSetting';
import { NavbarItem } from 'features/NavbarItem';
import { useTranslation } from 'react-i18next';
import { getAppRouteFromPath } from 'app/providers/router';
import { AppRoutes } from 'app/providers/router/config/routeConfig';
import { useEffect } from 'react';
import { UserService } from 'services/UserService/userService';
import { observer } from 'mobx-react-lite';
import ServerIcon from 'shared/assets/icons/navbar/server.svg';
import FolderIcon from 'shared/assets/icons/navbar/folder.svg';
import PersonalIcon from 'shared/assets/icons/navbar/personal.svg';
import userStore from 'app/store/userStore';
import style from './Navbar.module.scss';

interface NavbarProps {
    className?: string
}

function Navbar ({ className }: NavbarProps) {
    const { t } = useTranslation('translation');

    useEffect(() => {
        UserService.getUserData().then((userDataResult) => {
            if (userDataResult.isSuccess) {
                userStore.setUserData({
                    id: userDataResult.result.userId,
                    username: userDataResult.result.userName
                });
            }
        });
    }, [])

    return (
        <div className={classNames(style.navbar, {}, [className])}>
            <NavbarSetting/>
            <div className={style.common_block}>
                <PersonalIcon width={22} height={22}/>
                <h2 className={style.personal}>{userStore.userData?.username}</h2>
            </div>
            <div className={classNames(style.nav_items)}>
                <NavbarItem
                    icon={<ServerIcon width={'22px'} height={'22px'}/>}
                    label={t('Сервера')}
                    className={classNames(style.server)}
                    isSelected={getAppRouteFromPath(location.pathname) === AppRoutes.MAIN}
                    navigate={'/'}
                />
                <NavbarItem
                    icon={<FolderIcon width={'22px'} height={'22px'}/>}
                    label={t('SFTP')}
                    className={classNames(style.sftp)}
                />
                <NavbarItem
                    icon={<h1>{'{}'}</h1>}
                    label={t('Процедуры')}
                    className={classNames(style.snippets)}
                />
            </div>
        </div>
    )
}

export default observer(Navbar);
