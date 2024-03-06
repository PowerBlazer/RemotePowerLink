import {classNames} from 'shared/lib/classNames/classNames';
import style from './ButtonEdit.module.scss';
import {Button} from "shared/ui/Button/Button";
import {ServerManagerData} from "features/ServerManagerGroup";
import PencilIcon from 'shared/assets/icons/pencil.svg';
import {DataType} from "app/enums/DataType";
import userStore from "app/store/userStore";
import sidebarStore from "app/store/sidebarStore";
import {SidebarEditHost} from "widgets/SidebarEditHost";
import {EditServerResult} from "app/services/ServerService/config/serverConfig";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";
import {SidebarEditProxy} from "widgets/SidebarEditProxy";
import {EditProxyResult} from "app/services/ProxyService/config/proxyConfig";

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
            systemTypeName: editServerData.systemTypeName
        });
        
        toast.success(t("Успешно сохранено"));
    }
    
    const onSaveProxyHandler = async (editProxyData: EditProxyResult) => {
        userStore.setUserProxy({
            proxyId: editProxyData.proxyId,
            hostname: editProxyData.hostname,
            title: editProxyData.title,
            identityId:editProxyData.identityId,
            sshPort:editProxyData.sshPort
        });

        toast.success(t("Успешно сохранено"));
    }
    
    const editDataClickHandler = async () => {
        if(serverManagerData.dataType === DataType.SERVER){
            const serverData = userStore.userServers
                .find(p=>p.serverId == serverManagerData.id);
            
            if(serverData){
                sidebarStore.editHostData.server = serverData;
                await sidebarStore.setSidebar({
                    name:`SidebarEditHost ${serverManagerData.id}`,
                    sidebar: <SidebarEditHost isMain={true} onSave={onSaveServerHandler}/>
                })
            }
        }
        
        if(serverManagerData.dataType === DataType.PROXY){
            const proxyData = userStore.userProxies
                .find(p=>p.proxyId === serverManagerData.id);
            
            if(proxyData){
                sidebarStore.editProxyData.proxy = proxyData;
                await sidebarStore.setSidebar({
                    name: `SidebarEditProxy ${serverManagerData.id}`,
                    sidebar: <SidebarEditProxy isMain={true} onSave={onSaveProxyHandler}/>
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