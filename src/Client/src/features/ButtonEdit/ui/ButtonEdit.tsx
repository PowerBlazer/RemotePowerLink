import {classNames} from 'shared/lib/classNames/classNames';
import style from './ButtonEdit.module.scss';
import {Button} from "shared/ui/Button/Button";
import {ServerManagerData} from "features/ServerManagerGroup";
import PencilIcon from 'shared/assets/icons/pencil.svg';
import {DataType} from "app/enums/DataType";
import userStore from "app/store/userStore";
import sidebarStore from "app/store/sidebarStore";
import {SidebarEditHost} from "widgets/SidebarEditHost";

interface ButtonEditProps {
    className?: string;
    serverManagerData: ServerManagerData
}

export function ButtonEdit ({ className, serverManagerData }: ButtonEditProps) {
    
    const editDataClickHandler = async () => {
        if(serverManagerData.dataType === DataType.SERVER){
            const serverData = userStore.userServers
                .find(p=>p.serverId == serverManagerData.id);
            
            if(serverData){
                sidebarStore.editHostData.server = serverData;
                await sidebarStore.setSidebar({
                    name:`SidebarEditHost ${serverManagerData.id}`,
                    sidebar: <SidebarEditHost isMain={true}/>
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