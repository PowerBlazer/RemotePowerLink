import { classNames } from 'shared/lib/classNames/classNames';
import style from './ServerManagerCatalog.module.scss';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import userStore from 'app/store/userStore';
import { ServerManagerData, ServerManagerGroup } from 'features/ServerManagerGroup';
import { HostService } from 'app/services/hostService';
import { Loader } from 'shared/ui/Loader/Loader';
import { useTranslation } from 'react-i18next';
import { DataTypeEnum } from 'app/enums/DataTypeEnum';
import UserCard from 'shared/assets/icons/user-card.svg';
import ServerIcon from 'shared/assets/icons/navbar/server2.svg';
import searchStore from 'app/store/searchStore';
import { ServerData } from 'app/services/ServerService/config/serverConfig';
import { DefaultServerIcon } from 'features/DefaultServerIcon';

export enum ServerManagerCatalogMode {
    Catalog = 'CATALOG',
    Sftp = 'SFTP'
}

interface ServerManagerCatalogProps {
    className?: string;
    mode?: ServerManagerCatalogMode,
    onConnect?: (serverData: ServerData) => Promise<void>
}

function ServerManagerCatalog ({ className, mode = ServerManagerCatalogMode.Catalog, onConnect }: ServerManagerCatalogProps) {
    const { t } = useTranslation('translation');

    const identityIcon = useMemo(() => (
        <div className={classNames(style.identity_block)}>
            <UserCard width={30} height={30}/>
        </div>
    ), []);

    const serversManagerData = useMemo<ServerManagerData[]>(() =>
        searchStore.searchData.servers?.map(server => ({
            id: server.serverId,
            title: server.title,
            common: server.systemTypeName,
            dataType: DataTypeEnum.SERVER,
            iconUrl: Boolean(server.systemTypeIcon) && `${HostService._resourceHost}${server.systemTypeIcon}`,
            iconNode: !server.systemTypeIcon && <DefaultServerIcon width={25} height={25}/>
        })
        ), [searchStore.searchData]);

    const proxiesManagerData = useMemo<ServerManagerData[]>(() =>
        searchStore.searchData.proxies?.map(proxy => ({
            id: proxy.proxyId,
            dataType: DataTypeEnum.PROXY,
            title: proxy.title,
            iconNode: <DefaultServerIcon width={25} height={25}/>
        })
        ), [searchStore.searchData]);

    const identityManagerData = useMemo<ServerManagerData[]>(() =>
        searchStore.searchData.identities?.map(identity => {
            return {
                id: identity.identityId,
                dataType: DataTypeEnum.IDENTITY,
                iconNode: identityIcon,
                title: identity.title,
                common: identity.username
            }
        }
        ), [searchStore.searchData]);

    const serverManagerGroups = useMemo(() => {
        return [
            <ServerManagerGroup serverManagerDataList={serversManagerData} headerName={t('Сервера')} key={'Servers'}/>,
            <ServerManagerGroup serverManagerDataList={proxiesManagerData} headerName={t('Прокси')} key={'Proxies'}/>,
            <ServerManagerGroup serverManagerDataList={identityManagerData} headerName={t('Идентификаторы')} key={'Identities'}/>
        ]
    }, [serversManagerData, identityManagerData, proxiesManagerData]);

    const serversGroup = useMemo(() => {
        return [
            <ServerManagerGroup
                serverManagerDataList={serversManagerData}
                mode={mode}
                headerName={t('Сервера')}
                key={'Servers'}
                onConnect={onConnect}
            />
        ]
    }, [serversManagerData]);

    useEffect(() => {
        searchStore.setFilterOption(null)
    }, []);

    return (
        <div className={classNames(style.serverManagerCatalog, {}, [className])}>
            <div className={classNames(style.catalog_inner)}>
                {
                    userStore.isLoadData
                        ? <Loader className={classNames(style.loader)}/>
                        : mode === ServerManagerCatalogMode.Catalog ? serverManagerGroups : serversGroup
                }
            </div>
        </div>
    );
}

export default observer(ServerManagerCatalog)
