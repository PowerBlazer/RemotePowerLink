import { classNames } from 'shared/lib/classNames/classNames';
import { NavbarSetting } from 'widgets/NavbarSetting';
import { NavbarItem } from 'features/NavbarItem';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from 'app/providers/router/config/routeConfig';
import { useEffect, useState } from 'react';
import { UserService } from 'app/services/UserService/userService';
import { observer } from 'mobx-react-lite';
import ServerIcon from 'shared/assets/icons/server-minimalistic.svg';
import FolderIcon from 'shared/assets/icons/navbar/folder.svg';
import PersonalIcon from 'shared/assets/icons/navbar/personal.svg';
import ClockIcon from 'shared/assets/icons/clock.svg';
import TerminalIcon from 'shared/assets/icons/terminal.svg';
import userStore from 'app/store/userStore';
import style from './Navbar.module.scss';
import { useEffectLoad } from 'app/hooks/useLoad';
import { Loader } from 'shared/ui/Loader/Loader';
import { IdentityService } from 'app/services/IdentityService/identityService';
import { ProxyService } from 'app/services/ProxyService/proxyService';
import { ServerService } from 'app/services/ServerService/serverService';
import searchStore from 'app/store/searchStore';
import { EncodingService } from 'app/services/EncodingService/encodingService';
import terminalStore, { TerminalSession } from 'app/store/terminalStore';
import { SessionService } from 'app/services/SessionService/sessionService';
import TerminalHub from 'app/hubs/terminalHub';
import toast from 'react-hot-toast';
import { TerminalService } from 'app/services/TerminalService/terminalService';
import { ConnectionState } from 'app/hubs/hubFactory';
import useTerminal from 'app/hooks/useTerminal';
import useApp from 'app/hooks/useApp';

interface NavbarProps {
    className?: string
}

function Navbar ({ className }: NavbarProps) {
    const { t } = useTranslation('translation');
    const [hasLoadError, setHasError] = useState(false);

    const { loadData } = useApp()

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
        loadData(() => {
            setHasError(true);
        });
    }, []);

    if (hasLoadError) {
        throw new Error('Ошибка загрузка данных, перезагрузите страницу или обратитесь в тех поддержку')
    }

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
                    icon={<TerminalIcon width={'23px'} height={'23px'}/>}
                    label={t('Терминал')}
                    isSelected={userStore.location === AppRoutes.TERMINAL}
                    navigate={`/${AppRoutes.TERMINAL}`}
                    className={classNames(style.terminal)}
                    onNavigate={() => { userStore.location = AppRoutes.TERMINAL }}
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
