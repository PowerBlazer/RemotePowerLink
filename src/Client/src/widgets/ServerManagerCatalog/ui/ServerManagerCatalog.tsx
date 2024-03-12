import {classNames} from 'shared/lib/classNames/classNames';
import style from './ServerManagerCatalog.module.scss';
import {observer} from "mobx-react-lite";
import {useMemo} from "react";
import userStore from "app/store/userStore";
import {ServerManagerData, ServerManagerGroup} from "features/ServerManagerGroup";
import {HostService} from "app/services/hostService";
import {Loader} from "shared/ui/Loader/Loader";
import {useTranslation} from "react-i18next";
import {DataTypeEnum} from "app/enums/DataTypeEnum";
import UserCard from 'shared/assets/icons/user-card.svg';
import ServerIcon from "shared/assets/icons/navbar/server2.svg";

interface ServerManagerCatalogProps {
    className?: string;
}

function ServerManagerCatalog ({ className }: ServerManagerCatalogProps) {
    const { t } = useTranslation('translation');
    
    const defaultServerIcon = useMemo(()=>(
        <div className={classNames(style.server_block)}>
            <ServerIcon width={20} height={20}/>
        </div>
    ),[])

    const identityIcon = useMemo(() => (
        <div className={classNames(style.identity_block)}>
            <UserCard width={30} height={30}/>
        </div>
    ),[]);
    
    const serversManagerData = useMemo<ServerManagerData[]>(() => 
        userStore.userServers?.map((server => ({
            id: server.serverId,
            title: server.title,
            common: server.systemTypeName,
            dataType: DataTypeEnum.SERVER,
            iconUrl: Boolean(server.systemTypeIcon) && `${HostService._apiHost}/${server.systemTypeIcon}`,
            iconNode: !Boolean(server.systemTypeIcon) && defaultServerIcon
        })
    )),[userStore.userServers]);
    
    const proxiesManagerData = useMemo<ServerManagerData[]>(() =>
        userStore.userProxies?.map((proxy => ({
            id: proxy.proxyId,
            dataType: DataTypeEnum.PROXY,
            title: proxy.title, 
            iconNode: defaultServerIcon
        })
    )),[userStore.userProxies]);

    const identityManagerData = useMemo<ServerManagerData[]>(() =>
        userStore.userIdentities?.map((identity => {
            return {
                id: identity.identityId,
                dataType:DataTypeEnum.IDENTITY,
                iconNode:identityIcon,
                title: identity.title,
                common: identity.username
            }
        }
    )),[userStore.userIdentities]);
    
    const serverManagerGroups = useMemo(()=> {
        return [
            <ServerManagerGroup serverManagerDataList={serversManagerData} headerName={t('Сервера')} key={'Servers'}/>,
            <ServerManagerGroup serverManagerDataList={proxiesManagerData} headerName={t('Прокси')} key={'Proxies'}/>,
            <ServerManagerGroup serverManagerDataList={identityManagerData} headerName={t('Идентификаторы')} key={'Identities'}/>
        ]
    },[serversManagerData, identityManagerData, proxiesManagerData]);
    
    return (
        <div className={classNames(style.serverManagerCatalog, {}, [className])}>
            <div className={classNames(style.catalog_inner)}>
                {
                    userStore.isLoadData 
                        ? <Loader  className={classNames(style.loader)}/>
                        : serverManagerGroups
                }
            </div>
		</div>
    );
}

export default observer(ServerManagerCatalog)