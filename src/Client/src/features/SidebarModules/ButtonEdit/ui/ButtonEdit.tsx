import { classNames } from 'shared/lib/classNames/classNames';
import style from './ButtonEdit.module.scss';
import { Button } from 'shared/ui/Button/Button';
import { ServerManagerData } from 'features/ServerManagerGroup';
import PencilIcon from 'shared/assets/icons/pencil.svg';
import { DataTypeEnum } from 'app/enums/DataTypeEnum';
import userStore from 'app/store/userStore';
import sidebarStore from 'app/store/sidebarStore';
import { SidebarEditHost } from 'widgets/Sidebars/SidebarEditHost';
import { useTranslation } from 'react-i18next';
import { SidebarEditProxy } from 'widgets/Sidebars/SidebarEditProxy';
import { SidebarEditIdentity } from 'widgets/Sidebars/SidebarEditIdentity';

interface ButtonEditProps {
    className?: string;
    serverManagerData: ServerManagerData
}

export function ButtonEdit ({ className, serverManagerData }: ButtonEditProps) {
    const { t } = useTranslation('translation')

    const editDataClickHandler = async () => {
        if (serverManagerData.dataType === DataTypeEnum.SERVER) {
            const serverData = userStore.userServers
                .find(p => p.serverId === serverManagerData.id);

            if (serverData) {
                sidebarStore.mainSidebar.editHostData.data = serverData;

                await sidebarStore.setSidebar(sidebarStore.mainSidebar, {
                    name: `SidebarEditHost ${serverManagerData.id}`,
                    element: <SidebarEditHost isMain={true}/>
                })
            }
        }

        if (serverManagerData.dataType === DataTypeEnum.PROXY) {
            const proxyData = userStore.userProxies
                .find(p => p.proxyId === serverManagerData.id);

            if (proxyData) {
                sidebarStore.mainSidebar.editProxyData.data = proxyData;
                await sidebarStore.setSidebar(sidebarStore.mainSidebar, {
                    name: `SidebarEditProxy ${serverManagerData.id}`,
                    element: <SidebarEditProxy isMain={true} />
                })
            }
        }

        if (serverManagerData.dataType === DataTypeEnum.IDENTITY) {
            const identityData = userStore.userIdentities
                .find(p => p.identityId === serverManagerData.id);

            if (identityData) {
                sidebarStore.mainSidebar.editIdentityData.data = identityData;
                await sidebarStore.setSidebar(sidebarStore.mainSidebar, {
                    name: `SidebarEditIdentity ${serverManagerData.id}`,
                    element: <SidebarEditIdentity isMain={true} />
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
