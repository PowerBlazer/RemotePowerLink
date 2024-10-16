import { classNames } from 'shared/lib/classNames/classNames';
import style from './ButtonEdit.module.scss';
import { Button } from 'shared/ui/Button/Button';
import { ServerManagerData } from 'features/ServerManagerGroup';
import PencilIcon from 'shared/assets/icons/pencil.svg';
import { DataTypeEnum } from 'app/enums/DataTypeEnum';
import userStore from 'app/store/userStore';
import sidebarStore from 'app/store/sidebarStore';
import { SidebarEditHost } from 'widgets/Sidebars/SidebarEditHost';
import { EditServerResult } from 'app/services/ServerService/config/serverConfig';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { SidebarEditProxy } from 'widgets/Sidebars/SidebarEditProxy';
import { EditProxyResult } from 'app/services/ProxyService/config/proxyConfig';
import { SidebarEditIdentity } from 'widgets/Sidebars/SidebarEditIdentity';
import { EditIdentityResult } from 'app/services/IdentityService/config/identityConfig';

interface ButtonEditProps {
    className?: string;
    serverManagerData: ServerManagerData
}

export function ButtonEdit ({ className, serverManagerData }: ButtonEditProps) {
    const { t } = useTranslation('translation')
    const onSaveServerHandler = async (editServerData: EditServerResult) => {
        userStore.setUserServer({
            serverId: editServerData.serverId,
            hostname: editServerData.hostname,
            title: editServerData.title,
            identityId: editServerData.identityId,
            proxyId: editServerData.proxyId,
            sshPort: editServerData.sshPort,
            startupCommand: editServerData.startupCommand,
            systemTypeIcon: editServerData.systemTypeIcon,
            systemTypeName: editServerData.systemTypeName,
            dateCreated: editServerData.dateCreated,
            encodingId: editServerData.encodingId
        });

        toast.success(t('Успешно сохранено'));
    }

    const onSaveProxyHandler = async (editProxyData: EditProxyResult) => {
        userStore.setUserProxy({
            proxyId: editProxyData.proxyId,
            hostname: editProxyData.hostname,
            title: editProxyData.title,
            identityId: editProxyData.identityId,
            sshPort: editProxyData.sshPort,
            dateCreated: editProxyData.dateCreated
        });

        toast.success(t('Успешно сохранено'));
    }

    const onSaveIdentityHandler = async (editIdentityData: EditIdentityResult) => {
        userStore.setUserIdentity({
            identityId: editIdentityData.identityId,
            title: editIdentityData.title,
            username: editIdentityData.username,
            dateCreated: editIdentityData.dateCreated
        });

        toast.success(t('Успешно сохранено'));
    }

    const editDataClickHandler = async () => {
        if (serverManagerData.dataType === DataTypeEnum.SERVER) {
            const serverData = userStore.userServers
                .find(p => p.serverId === serverManagerData.id);

            if (serverData) {
                sidebarStore.editHostData.server = serverData;
                await sidebarStore.setSidebar({
                    name: `SidebarEditHost ${serverManagerData.id}`,
                    sidebar: <SidebarEditHost isMain={true} onSave={onSaveServerHandler}/>
                })
            }
        }

        if (serverManagerData.dataType === DataTypeEnum.PROXY) {
            const proxyData = userStore.userProxies
                .find(p => p.proxyId === serverManagerData.id);

            if (proxyData) {
                sidebarStore.editProxyData.proxy = proxyData;
                await sidebarStore.setSidebar({
                    name: `SidebarEditProxy ${serverManagerData.id}`,
                    sidebar: <SidebarEditProxy isMain={true} onSave={onSaveProxyHandler}/>
                })
            }
        }

        if (serverManagerData.dataType === DataTypeEnum.IDENTITY) {
            const identityData = userStore.userIdentities
                .find(p => p.identityId === serverManagerData.id);

            if (identityData) {
                sidebarStore.editIdentityData.identity = identityData;
                await sidebarStore.setSidebar({
                    name: `SidebarEditIdentity ${serverManagerData.id}`,
                    sidebar: <SidebarEditIdentity isMain={true} onSave={onSaveIdentityHandler}/>
                })
            }
        }
    }

    return (
        <Button
            className={classNames(style.buttonEdit, {}, [className])}
            onClick={editDataClickHandler}
        >
            <PencilIcon width={20} height={20}/>
        </Button>
    );
}
