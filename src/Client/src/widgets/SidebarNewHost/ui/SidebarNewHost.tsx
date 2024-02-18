import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarNewHost.module.scss';
import { observer } from 'mobx-react-lite';
import { Sidebar } from 'widgets/Sidebar';
import {FormBlock} from "features/FormBlock";
import ServerIcon from 'shared/assets/icons/navbar/server2.svg';
import TitleIcon from 'shared/assets/icons/title.svg';
import PortIcon from 'shared/assets/icons/code-working.svg';
import ScriptIcon from 'shared/assets/icons/curly-braces.svg'
import DoubleArrow from 'shared/assets/icons/double-arrow.svg';
import {Input} from "shared/ui/Input";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import sidebarStore from "app/store/sidebarStore";
import {IdentityService} from "services/IdentityService/identityService";
import {ProxyService} from "services/ProxyService/proxyService";
import {Select, SelectItem} from "shared/ui/Select";


interface SidebarNewHostProps {
    className?: string;
    isMain?: boolean;
}

function SidebarNewHost ({ className, isMain = false }: SidebarNewHostProps) {
    const { t } = useTranslation('translation');
    const [load,setLoad] = useState<boolean>(true);

    const closeHandler = async () => {
        if(!isMain){
            sidebarStore.newHostData.isVisible = false;
        }
    }
    
    useEffect( () => {
        async function loadData(){
            if(!sidebarStore.newHostData.identities){
                const identitiesResult = await IdentityService.getIdentities();
                sidebarStore.newHostData.identities = identitiesResult.result;
            }

            if(!sidebarStore.newHostData.proxies){
                const proxiesResult = await ProxyService.getProxies();
                sidebarStore.newHostData.proxies = proxiesResult.result;
            }
            
            setLoad(false);
        }
        
        loadData();
    }, []);
    
    
    
    return (
        <Sidebar
            className={classNames(style.sidebarNewHost, {}, [className])}
            isMain={isMain}
            headerName={'Новый сервер'}
            isLoad={load}
            close={closeHandler}
        >
            <FormBlock headerName={'Адресс'}>
                <div className={classNames(style.address_block)}>
                    <div className={classNames(style.icon_server)}>
                        <ServerIcon width={24} height={24}/>
                    </div>
                    <Input type={"text"} className={style.address_input} placeholder={t('IP или домен')}/>
                </div>
            </FormBlock>
            <FormBlock headerName={'Главная'}>
                <div className={classNames(style.general_block)}>
                    <Input 
                        type={"text"} 
                        className={classNames(style.title_input)} 
                        placeholder={t('Название')} 
                        icon={<TitleIcon width={20} height={20}/>}
                    />
                    <Input 
                        type={"text"}
                        className={classNames(style.port_input)}
                        placeholder={t('Порт')}
                        icon={<PortIcon width={20} height={20}/>}
                    />
                    <Input
                        type={"text"}
                        className={classNames(style.startup_command_input)}
                        placeholder={t('Стартовая команда')}
                        icon={<ScriptIcon width={20} height={20}/>}
                    />
                </div>
            </FormBlock>
            <FormBlock headerName={'Прокси'}>
                <Select placeholder={'Select proxy'} icon={<DoubleArrow width={19} height={19}/>}>
                    {sidebarStore.newHostData.proxies?.map((proxy)=>
                        <SelectItem key={proxy.id} selectedItem={{ id: proxy.id.toString(), title: proxy.title }}/>
                    )}
                </Select>
            </FormBlock>
            <FormBlock headerName={'Учетные данные'}>
                
            </FormBlock>
        </Sidebar>
    );
}

export default observer(SidebarNewHost)
