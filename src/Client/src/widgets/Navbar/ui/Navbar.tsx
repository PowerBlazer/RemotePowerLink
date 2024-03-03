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
import { useEffectLoad } from 'app/hooks/useLoad';
import { Loader } from 'shared/ui/Loader/Loader';
import {IdentityService} from "services/IdentityService/identityService";
import {ProxyService} from "services/ProxyService/proxyService";

interface NavbarProps {
    className?: string
}

function Navbar ({ className }: NavbarProps) {
    const { t } = useTranslation('translation');

    const { isLoad } = useEffectLoad(async () => {
        if(!userStore.userData){
            const userDataResult = await UserService.getUserData();
            userStore.setUserData(userDataResult.result);
        }
        
        if (!userStore.userIdentities) {
            const identitiesResult = await IdentityService.getIdentities();
            userStore.setUserIdentities(identitiesResult.result);
        }

        if (!userStore.userProxies) {
            const proxiesResult = await ProxyService.getProxies();
            userStore.setUserProxies(proxiesResult.result);
        }
    });

    useEffect(() => {
        userStore.setLoad(isLoad);
    }, [isLoad]);

    return (
        <div className={classNames(style.navbar, {}, [className])}>
            <NavbarSetting/>
            <div className={style.common_block}>
                { isLoad
                    ? <Loader className={classNames(style.loader)}/>
                    : <>
                        <PersonalIcon width={22} height={22}/>
                        <h2 className={style.personal}>{userStore.userData?.username}</h2>
                    </>
                }
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
