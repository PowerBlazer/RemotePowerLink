import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarHosts.module.scss';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared/ui/Button/Button';
import ServerIcon from 'shared/assets/icons/navbar/server.svg';
import DoubleArrow from 'shared/assets/icons/double-arrow.svg';
import Card from 'shared/assets/icons/navbar/card.svg';
import sidebarStore from 'app/store/sidebarStore';
import { SidebarNewHost } from 'widgets/SidebarNewHost';
import { SidebarNewProxy } from 'widgets/SidebarNewProxy';
import SidebarNewIdentity from 'widgets/SidebarNewIdentity/ui/SidebarNewIdentity';
import { observer } from 'mobx-react-lite';
import { CreateServerResult, EditServerResult } from 'app/services/ServerService/config/serverConfig';
import userStore from 'app/store/userStore';
import { SidebarEditHost } from 'widgets/SidebarEditHost';
import toast from 'react-hot-toast';
import { CreateProxyResult, EditProxyResult, ProxyData } from 'app/services/ProxyService/config/proxyConfig';
import { SidebarEditProxy } from 'widgets/SidebarEditProxy';
import {
    CreateIdentityResult,
    EditIdentityResult,
    IdentityData
} from 'app/services/IdentityService/config/identityConfig';
import { SidebarEditIdentity } from 'widgets/SidebarEditIdentity';
import { ChangeEvent, useEffect } from 'react';
import searchStore from 'app/store/searchStore';

interface NavbarHostsProps {
    className?: string;
}

function NavbarHosts ({ className }: NavbarHostsProps) {
    const { t } = useTranslation('translation');

    const onEditServerHandler = async (editServerResult: EditServerResult) => {
        userStore.setUserServer({
            serverId: editServerResult.serverId,
            hostname: editServerResult.hostname,
            title: editServerResult.title,
            identityId: editServerResult.identityId,
            proxyId: editServerResult.proxyId,
            sshPort: editServerResult.sshPort,
            startupCommand: editServerResult.startupCommand,
            systemTypeIcon: editServerResult.systemTypeIcon,
            systemTypeName: editServerResult.systemTypeName,
            dateCreated: editServerResult.dateCreated
        });

        toast.success(t('Успешно сохранено'));
    }

    const onCreateServerHandler = async (createServerResult: CreateServerResult) => {
        const server = {
            serverId: createServerResult.serverId,
            title: createServerResult.title,
            sshPort: createServerResult.sshPort,
            hostname: createServerResult.hostname,
            identityId: createServerResult.identityId,
            proxyId: createServerResult.proxyId,
            startupCommand: createServerResult.startupCommand,
            systemTypeIcon: createServerResult.systemTypeIcon,
            systemTypeName: createServerResult.systemTypeName,
            dateCreated: createServerResult.dateCreated
        };

        userStore.setUserServer(server);

        sidebarStore.editHostData.server = server;

        await sidebarStore.setSidebar({
            name: `SidebarEditHost ${createServerResult.serverId}`,
            sidebar: <SidebarEditHost isMain={true} onSave={onEditServerHandler}/>
        });

        toast.success(t('Успешно создано'));
    }

    const onEditProxyHandler = async (editProxyResult: EditProxyResult) => {
        const proxy: ProxyData = {
            proxyId: editProxyResult.proxyId,
            title: editProxyResult.title,
            hostname: editProxyResult.hostname,
            identityId: editProxyResult.identityId,
            sshPort: editProxyResult.sshPort,
            dateCreated: editProxyResult.dateCreated
        };

        userStore.setUserProxy(proxy);

        toast.success(t('Успешно сохранено'));
    }

    const onCreateProxyHandler = async (createProxyResult: CreateProxyResult) => {
        const proxy: ProxyData = {
            proxyId: createProxyResult.proxyId,
            title: createProxyResult.title,
            hostname: createProxyResult.hostname,
            identityId: createProxyResult.identityId,
            sshPort: createProxyResult.sshPort,
            dateCreated: createProxyResult.dateCreated
        };

        userStore.setUserProxy(proxy);

        sidebarStore.editProxyData.proxy = proxy;

        await sidebarStore.setSidebar({
            name: `SidebarEditProxy ${createProxyResult.proxyId}`,
            sidebar: <SidebarEditProxy isMain={true} onSave={onEditProxyHandler}/>
        });

        toast.success(t('Успешно создано'));
    }

    const onEditIdentityHandler = async (editIdentityResult: EditIdentityResult) => {
        const identity: IdentityData = {
            title: editIdentityResult.title,
            identityId: editIdentityResult.identityId,
            username: editIdentityResult.username,
            dateCreated: editIdentityResult.dateCreated
        };

        userStore.setUserIdentity(identity);

        toast.success(t('Успешно сохранено'));
    }

    const onCreateIdentityHandler = async (createIdentityResult: CreateIdentityResult) => {
        const identity: IdentityData = {
            title: createIdentityResult.title,
            identityId: createIdentityResult.identityId,
            username: createIdentityResult.username,
            dateCreated: createIdentityResult.dateCreated
        };

        userStore.setUserIdentity(identity);

        sidebarStore.editIdentityData.identity = identity;

        await sidebarStore.setSidebar({
            name: `SidebarEditIdentity ${createIdentityResult.identityId}`,
            sidebar: <SidebarEditIdentity isMain={true} onSave={onEditIdentityHandler}/>
        });

        toast.success(t('Успешно создано'));
    }

    const createNewHostHandler = async () => {
        await sidebarStore.setSidebar({
            name: 'SidebarNewHost',
            sidebar: <SidebarNewHost isMain={true} onSave={onCreateServerHandler}/>
        });
    }

    const createNewProxy = async () => {
        await sidebarStore.setSidebar({
            name: 'SidebarNewProxy',
            sidebar: <SidebarNewProxy isMain={true} onSave={onCreateProxyHandler}/>
        })
    }

    const createNewIdentity = async () => {
        await sidebarStore.setSidebar({
            name: 'SidebarNewIdentity',
            sidebar: <SidebarNewIdentity isMain={true} onSave={onCreateIdentityHandler}/>
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
                <Button className={classNames(style.connect_button, {}, [])}>{t('Подключиться')}</Button>
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
