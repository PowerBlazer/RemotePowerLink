import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarHosts.module.scss';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared/ui/Button/Button';
import ServerIcon from 'shared/assets/icons/navbar/server.svg';
import DoubleArrow from 'shared/assets/icons/double-arrow.svg';
import Card from 'shared/assets/icons/navbar/card.svg';
import sidebarStore from 'app/store/sidebarStore';
import { SidebarNewHost } from 'widgets/Sidebars/SidebarNewHost';
import { SidebarNewProxy } from 'widgets/Sidebars/SidebarNewProxy';
import { SidebarNewIdentity } from 'widgets/Sidebars/SidebarNewIdentity';
import { observer } from 'mobx-react-lite';
import { CreateServerResult } from 'app/services/ServerService/config/serverConfig';
import userStore from 'app/store/userStore';
import { SidebarEditHost } from 'widgets/Sidebars/SidebarEditHost';
import toast from 'react-hot-toast';
import { CreateProxyResult, ProxyData } from 'app/services/ProxyService/config/proxyConfig';
import { SidebarEditProxy } from 'widgets/Sidebars/SidebarEditProxy';
import {
    CreateIdentityResult,
    IdentityData
} from 'app/services/IdentityService/config/identityConfig';
import { SidebarEditIdentity } from 'widgets/Sidebars/SidebarEditIdentity';
import { ChangeEvent } from 'react';
import searchStore from 'app/store/searchStore';
import { IdentityDataMapper } from 'app/mappers/identityDataMapper';

interface NavbarHostsProps {
    className?: string;
}

function NavbarHosts ({ className }: NavbarHostsProps) {
    const { t } = useTranslation('translation');

    const onCreateServerHandler = async (createServerResult: CreateServerResult) => {
        await sidebarStore.setSidebar(sidebarStore.mainSidebar, {
            name: `SidebarEditHost ${createServerResult.serverId}`,
            element: <SidebarEditHost isMain={true} />
        });
    }

    const onCreateProxyHandler = async (createProxyResult: CreateProxyResult) => {
        await sidebarStore.setSidebar(sidebarStore.mainSidebar, {
            name: `SidebarEditProxy ${createProxyResult.proxyId}`,
            element: <SidebarEditProxy isMain={true}/>
        });
    }

    const onCreateIdentityHandler = async (createIdentityResult: CreateIdentityResult) => {
        await sidebarStore.setSidebar(sidebarStore.mainSidebar, {
            name: `SidebarEditIdentity ${createIdentityResult.identityId}`,
            element: <SidebarEditIdentity isMain={true}/>
        });
    }

    const createNewHostHandler = async () => {
        await sidebarStore.setSidebar(sidebarStore.mainSidebar, {
            name: 'SidebarNewHost',
            element: <SidebarNewHost isMain={true} onSave={onCreateServerHandler}/>
        });
    }

    const createNewProxy = async () => {
        await sidebarStore.setSidebar(sidebarStore.mainSidebar, {
            name: 'SidebarNewProxy',
            element: <SidebarNewProxy isMain={true} onSave={onCreateProxyHandler}/>
        })
    }

    const createNewIdentity = async () => {
        await sidebarStore.setSidebar(sidebarStore.mainSidebar, {
            name: 'SidebarNewIdentity',
            element: <SidebarNewIdentity isMain={true} onSave={onCreateIdentityHandler}/>
        })
    }

    const onChangeSearchInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        searchStore.setFilterOption({
            title: e.target.value
        });
    }

    return (
        <div className={classNames(style.navbarHosts, {}, [className])}>
            <div className={classNames(style.search_block)}>
                <input
                    type={'text'}
                    className={classNames(style.search)}
                    placeholder={t('Поиск серверов или ssh root@hostname...')}
                    onChange={onChangeSearchInputHandler}
                />
                {/* <Button className={classNames(style.connect_button, {}, [])}>{t('Подключиться')}</Button> */}
            </div>

            <div className={classNames(style.control_panel)}>
                <div className={classNames(style.tools_panel)}>
                    <Button
                        className={classNames(style.newhost_button, {}, [style.tool_button])}
                        onClick={createNewHostHandler}
                    >
                        <ServerIcon width={'15px'} height={'15px'}/>
                        {t('Новый сервер')}
                    </Button>

                    <Button
                        className={classNames(style.newproxy_button, {}, [style.tool_button])}
                        onClick={createNewProxy}
                    >
                        <DoubleArrow width={'15px'} height={'15px'}/>
                        {t('Новый прокси')}
                    </Button>

                    <Button
                        className={classNames(style.newidentity_button, {}, [style.tool_button])}
                        onClick={createNewIdentity}
                    >
                        <Card width={'15px'} height={'15px'}/>
                        {t('Новый иденитификатор')}
                    </Button>
                </div>
                <div className={classNames(style.filter_tool_panel)}>

                </div>
            </div>
        </div>
    );
}

export default observer(NavbarHosts);
