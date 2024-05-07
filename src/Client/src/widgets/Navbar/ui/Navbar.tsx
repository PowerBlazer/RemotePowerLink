import { classNames } from 'shared/lib/classNames/classNames';
import { NavbarSetting } from 'widgets/NavbarSetting';
import { NavbarItem } from 'features/NavbarItem';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from 'app/providers/router/config/routeConfig';
import { useEffect } from 'react';
import { UserService } from 'app/services/UserService/userService';
import { observer } from 'mobx-react-lite';
import ServerIcon from 'shared/assets/icons/navbar/server.svg';
import FolderIcon from 'shared/assets/icons/navbar/folder.svg';
import PersonalIcon from 'shared/assets/icons/navbar/personal.svg';
import ClockIcon from 'shared/assets/icons/clock.svg';
import userStore from 'app/store/userStore';
import style from './Navbar.module.scss';
import { useEffectLoad } from 'app/hooks/useLoad';
import { Loader } from 'shared/ui/Loader/Loader';
import { IdentityService } from 'app/services/IdentityService/identityService';
import { ProxyService } from 'app/services/ProxyService/proxyService';
import { ServerService } from 'app/services/ServerService/serverService';
import searchStore from 'app/store/searchStore';
import { EncodingService } from 'app/services/EncodingService/encodingService';

interface NavbarProps {
    className?: string
}

function Navbar ({ className }: NavbarProps) {
    const { t } = useTranslation('translation');

    const { isLoad } = useEffectLoad(async () => {
        if (!userStore.userData) {
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

        if (!userStore.userServers) {
            const serversResult = await ServerService.getServers();
            userStore.setUserServers(serversResult.result);
        }

        if (!userStore.encodings) {
            const encodingsResult = await EncodingService.getEncodings();
            userStore.setUserEncodings(encodingsResult.result);
        }
    });

    useEffect(() => {
        searchStore.setSearchData({
            servers: userStore.userServers,
            proxies: userStore.userProxies,
            identities: userStore.userIdentities
        })
    }, [
        userStore.userProxies,
        userStore.userIdentities,
        userStore.userServers
    ]);

    useEffect(() => {
        userStore.setLoad(isLoad);
    }, [isLoad]);

    return (
        <div className={classNames(style.navbar, {}, [className])}>
            <NavbarSetting/>
            <div className={style.common_block}>
                { userStore.isLoadData
                    ? <Loader className={classNames(style.loader)}/>
                    : <>
                        <PersonalIcon width={22} height={22}/>
                        <h2 className={style.personal}>{userStore.userData?.username}</h2>
                    </>
                }
            </div>
            <div className={classNames(style.nav_items)}>
                <NavbarItem
                    icon={<ServerIcon width={'21px'} height={'21px'}/>}
                    label={t('Сервера')}
                    className={classNames(style.server)}
                    isSelected={userStore.location === AppRoutes.MAIN}
                    navigate={AppRoutes.MAIN}
                    onNavigate={() => { userStore.location = AppRoutes.MAIN }}
                />
                <NavbarItem
                    icon={<FolderIcon width={'21px'} height={'21px'}/>}
                    label={t('SFTP')}
                    isSelected={userStore.location === AppRoutes.SFTP}
                    navigate={`/${AppRoutes.SFTP}`}
                    className={classNames(style.sftp)}
                    onNavigate={() => { userStore.location = AppRoutes.SFTP }}
                />
                <NavbarItem
                    icon={<ClockIcon width={'21px'} height={'21px'}/>}
                    label={t('История')}
                    className={classNames(style.clock)}
                />
            </div>
        </div>
    )
}

export default observer(Navbar);
