import {classNames} from 'shared/lib/classNames/classNames';
import style from './SidebarNewHost.module.scss';
import {observer} from 'mobx-react-lite';
import {Sidebar, SidebarOptions} from 'widgets/Sidebar';
import {FormBlock} from "features/FormBlock";
import ServerIcon from 'shared/assets/icons/navbar/server2.svg';
import TitleIcon from 'shared/assets/icons/title.svg';
import PortIcon from 'shared/assets/icons/code-working.svg';
import ScriptIcon from 'shared/assets/icons/curly-braces.svg'
import DoubleArrow from 'shared/assets/icons/double-arrow.svg';
import {Input} from "shared/ui/Input";
import {useTranslation} from "react-i18next";
import {ChangeEvent, useMemo, useState} from "react";
import sidebarStore from "app/store/sidebarStore";
import {IdentityService} from "services/IdentityService/identityService";
import {ProxyService} from "services/ProxyService/proxyService";
import {Select, SelectedItem, SelectItem} from "shared/ui/Select";
import {Button, ThemeButton} from "shared/ui/Button/Button";
import {SidebarNewProxy} from "widgets/SidebarNewProxy";
import SidebarNewIdentity from "widgets/SidebarNewIdentity/ui/SidebarNewIdentity";
import {CreateServerData} from "services/ServerService/config/serverConfig";
import {ButtonLoader} from "shared/ui/ButtonLoader";
import {ServerService} from "services/ServerService/serverService";
import {useEffectLoad} from "app/hooks/useLoad";
import {CreateProxyResult} from "services/ProxyService/config/proxyConfig";
import {CreateIdentityResult} from "services/IdentityService/config/identityConfig";


interface SidebarNewHostProps extends SidebarOptions<CreateServerData> {
    className?: string;
}

const defaultServerValue = {
    hostname:"",
    title:"",
    identityId:0
}

function SidebarNewHost ({ className, isMain = false, onSave }: SidebarNewHostProps) {
    const { t } = useTranslation('translation');
    const [serverData, setServerData] = useState<CreateServerData>(defaultServerValue) 

    const closeHandler = async () => {
        if(!isMain){
            sidebarStore.newHostData.isVisible = false;
        }
    }
    
    const createProxyHandler = () => {
        sidebarStore.newProxyData.isVisible = true;
    }
    
    const createIdentityHandler = () => {
        sidebarStore.newIdentityData.isVisible = true;
    }
    
    const selectProxyHandler = (selectedItem:SelectedItem) => {
        setServerData(prevData=> ({
            ...prevData,
            proxyId: Number(selectedItem.id)
        }));
    }

    const selectIdentityHandler = (selectedItem:SelectedItem) => {
        setServerData(prevData=> ({
            ...prevData,
            identityId: Number(selectedItem.id)
        }));
    }
    
    const hostnameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setServerData(prevData => ({
            ...prevData,
            hostname: e.target.value
        }));
    }
    
    const nameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setServerData(prevData => ({
            ...prevData,
            title: e.target.value
        }));
    }

    const portChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setServerData(prevData => ({
            ...prevData,
            port: Number(e.target.value)
        }));
    }
    
    const startupCommandChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setServerData(prevData => ({
            ...prevData,
            startupCommand: e.target.value
        }));
    }
    
    const createServerClickHandler = async () => {
        const createServerResult = await ServerService.createServer(serverData);
        
        if(onSave && createServerResult.isSuccess){
            await onSave(createServerResult.result);
        }
    }
    
    const createProxyOnSaveHandler = async (createProxyResult: CreateProxyResult) => {
        sidebarStore.newHostData.proxies = [
            ...sidebarStore.newHostData.proxies, 
            { id: createProxyResult.proxyId, title: createProxyResult.title }
        ]
    }
    
    const createIdentityOnSaveHandler = async (createIdentityResult: CreateIdentityResult) => {
        sidebarStore.newHostData.identities = [
            ...sidebarStore.newHostData.identities,
            { id: createIdentityResult.identityId, title: createIdentityResult.title }
        ]

        sidebarStore.newHostData.identities = [
            ...sidebarStore.newProxyData.identities,
            { id: createIdentityResult.identityId, title: createIdentityResult.title }
        ]
    }
    
    const { isLoad } = useEffectLoad(async ()=> {
        if(!sidebarStore.newHostData.identities){
            const identitiesResult = await IdentityService.getIdentities();
            sidebarStore.newHostData.identities = identitiesResult.result;
        }

        if(!sidebarStore.newHostData.proxies){
            const proxiesResult = await ProxyService.getProxies();
            sidebarStore.newHostData.proxies = proxiesResult.result;
        }
    });
    
    const sidebars = useMemo(() => [
        <SidebarNewProxy key="proxy" isMain={false} onSave={createProxyOnSaveHandler}/>,
        <SidebarNewIdentity key="identity" isMain={false} onSave={createIdentityOnSaveHandler}/>
    ],[])
    
    return (
        <Sidebar
            className={classNames(style.sidebarNewHost, {}, [className])}
            headerName={'Новый сервер'}
            close={closeHandler}
            sidebars={isMain && sidebars}
            isMain={isMain}
            isLoad={isLoad}
        >
            <div className={classNames(style.content)}>
                <div className={classNames(style.content_inner)}>
                    <FormBlock headerName={'Адресс'}>
                        <div className={classNames(style.address_block)}>
                            <div className={classNames(style.icon_server)}>
                                <ServerIcon width={24} height={24}/>
                            </div>
                            <Input
                                type={"text"}
                                className={style.address_input}
                                placeholder={t('IP или домен')}
                                onChange={hostnameChangeHandler}
                            />
                        </div>
                    </FormBlock>
                    <FormBlock headerName={'Главная'}>
                        <div className={classNames(style.general_block)}>
                            <Input
                                type={"text"}
                                className={classNames(style.title_input)}
                                placeholder={t('Название')}
                                icon={<TitleIcon width={20} height={20}/>}
                                onChange={nameChangeHandler}
                            />
                            <Input
                                type={"text"}
                                className={classNames(style.port_input)}
                                placeholder={t('Ssh порт')}
                                icon={<PortIcon width={20} height={20}/>}
                                onChange={portChangeHandler}
                            />
                            <Input
                                type={"text"}
                                className={classNames(style.startup_command_input)}
                                placeholder={t('Стартовая команда')}
                                icon={<ScriptIcon width={20} height={20}/>}
                                onChange={startupCommandChangeHandler}
                            />
                        </div>
                    </FormBlock>
                    <FormBlock headerName={'Прокси'} className={classNames(style.proxy_block)}>
                        <Select
                            placeholder={'Выбрать прокси'}
                            icon={<DoubleArrow width={19} height={19}/>}
                            onChange={selectProxyHandler}
                        >
                            {sidebarStore.newHostData.proxies?.map((proxy) =>
                                <SelectItem key={proxy.id}
                                            selectedItem={{id: proxy.id.toString(), title: proxy.title}}/>
                            )}
                        </Select>
                        <Button
                            className={classNames(style.create_proxy)}
                            theme={ThemeButton.PRIMARY}
                            onClick={createProxyHandler}
                        >
                            {t("Создать прокси сервер")}
                        </Button>
                    </FormBlock>
                    <FormBlock headerName={'Учетные данные'} className={classNames(style.identity_block)}>
                        <Select
                            placeholder={'Выбрать учетку'}
                            icon={<DoubleArrow width={19} height={19}/>}
                            onChange={selectIdentityHandler}
                        >
                            {sidebarStore.newHostData.identities?.map((proxy) =>
                                <SelectItem key={proxy.id}
                                            selectedItem={{id: proxy.id.toString(), title: proxy.title}}/>
                            )}
                        </Select>
                        <Button
                            className={classNames(style.create_identity)}
                            theme={ThemeButton.PRIMARY}
                            onClick={createIdentityHandler}
                        >
                            {t("Создать учетку")}
                        </Button>
                    </FormBlock>
                </div>
                <div className={classNames(style.save_block)}>
                    <ButtonLoader
                        className={classNames(style.create_newhost)}
                        theme={ThemeButton.PRIMARY}
                        actionAsync={createServerClickHandler}
                    >
                        {t("Создать сервер")}
                    </ButtonLoader>
                </div>
            </div>
        </Sidebar>
    );
}

export default observer(SidebarNewHost)
