import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarEditHost.module.scss';
import {observer} from "mobx-react-lite";
import {Sidebar, SidebarOptions} from "widgets/Sidebar";
import {useTranslation} from "react-i18next";
import {useMemo, useState} from "react";
import sidebarStore from "app/store/sidebarStore";
import {SidebarNewProxy} from "widgets/SidebarNewProxy";
import {SidebarNewIdentity} from "widgets/SidebarNewIdentity";
import {CreateProxyResult} from "app/services/ProxyService/config/proxyConfig";
import userStore from "app/store/userStore";
import {CreateIdentityResult} from "app/services/IdentityService/config/identityConfig";
import {CreateServerData} from "app/services/ServerService/config/serverConfig";
import {Select, SelectedItem, SelectItem} from "shared/ui/Select";
import {FormBlock} from "features/FormBlock";
import ServerIcon from "shared/assets/icons/navbar/server2.svg";
import {Input} from "shared/ui/Input";
import TitleIcon from "shared/assets/icons/title.svg";
import PortIcon from "shared/assets/icons/code-working.svg";
import ScriptIcon from "shared/assets/icons/curly-braces.svg";
import DoubleArrow from "shared/assets/icons/double-arrow.svg";
import {Button, ThemeButton} from "shared/ui/Button/Button";

interface SidebarEditHostProps extends SidebarOptions<any>{
    className?: string;
}

function SidebarEditHost (props: SidebarEditHostProps) {
    
    const {
        className,
        onClose,
        onSave,
        isMain = false
    } = props;
    
    const server = sidebarStore.editHostData.server;
    const identity = userStore.userIdentities.find(p=>p.identityId === server.identityId);
    const proxy = userStore.userProxies.find(p=>p.proxyId === server.proxyId);
    
    const { t } = useTranslation('translation');
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const [serverData, setServerData] = useState<CreateServerData>();
    
    const [selectedProxy, setProxy] = useState<SelectedItem>(
        proxy && { id: proxy.proxyId.toString(), title: proxy.title }
    );
    
    const [selectedIdentity, setIdentity] = useState<SelectedItem>({
        id:identity.identityId.toString(),
        title:identity.title
    });

    const [isVisibleIdentity, setVisibleIdentity] = useState<boolean>(false);
    const [isVisibleProxy, setVisibleProxy] = useState<boolean>(false);

    const closeHandler = async () => {
        if (onClose) {
            onClose();
        }

        if (!isMain) {
            sidebarStore.editHostData.isVisible = false;
        }
    }
    const createProxyOnSaveHandler = async (createProxyResult: CreateProxyResult) => {
        userStore.setUserProxy({
            proxyId: createProxyResult.proxyId,
            title: createProxyResult.title,
            hostname: createProxyResult.hostname,
            identityId: createProxyResult.identityId,
            sshPort: createProxyResult.sshPort
        });

        setVisibleProxy(false);

        setProxy({ id: createProxyResult.proxyId.toString(), title: createProxyResult.title });

        setServerData(prevData => ({
            ...prevData,
            proxyId: Number(createProxyResult.proxyId)
        }));

        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors.ProxyId;
            return updatedErrors;
        });
    }

    const createIdentityOnSaveHandler = async (createIdentityResult: CreateIdentityResult) => {
        userStore.setUserIdentity({
            identityId: createIdentityResult.identityId,
            title: createIdentityResult.title
        });

        setVisibleIdentity(false);

        setIdentity({ id: createIdentityResult.identityId.toString(), title: createIdentityResult.title });

        setServerData(prevData => ({
            ...prevData,
            identityId: Number(createIdentityResult.identityId)
        }));

        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors.IdentityId;
            return updatedErrors;
        });
    }
    

    const sidebars = useMemo(() => [
        <SidebarNewProxy
            key="proxy"
            isMain={false}
            onSave={createProxyOnSaveHandler}
            onClose={()=> setVisibleProxy(false)}
            isVisible={isVisibleProxy}
        />,
        <SidebarNewIdentity
            key="identity"
            isMain={false}
            onSave={createIdentityOnSaveHandler}
            onClose={() => setVisibleIdentity(false)}
            isVisible={isVisibleIdentity}
        />
    ], [isVisibleIdentity, isVisibleProxy]);
    
    
    
    return (
        <Sidebar
            className={classNames(style.sidebarEditHost, {}, [className])}
            sidebars={sidebars}
            isMain={isMain}
            close={closeHandler}
            headerName={'Редактирование сервера'}
        >
            <FormBlock headerName={'Адресс'}>
                <div className={classNames(style.address_block)}>
                    <div className={classNames(style.icon_server)}>
                        <ServerIcon width={24} height={24}/>
                    </div>
                    <Input
                        type={'text'}
                        className={style.address_input}
                        placeholder={t('IP или домен')}
                        errors={errors.Hostname ?? null}
                        value={server.hostname}
                    />
                </div>
            </FormBlock>
            <FormBlock headerName={'Главная'}>
                <div className={classNames(style.general_block)}>
                    <Input
                        type={'text'}
                        className={classNames(style.title_input)}
                        placeholder={t('Название')}
                        icon={<TitleIcon width={20} height={20}/>}
                        errors={errors?.Title ?? null}
                        value={server.title}
                    />
                    <Input
                        type={'text'}
                        className={classNames(style.port_input)}
                        placeholder={t('Ssh порт')}
                        icon={<PortIcon width={20} height={20}/>}
                        errors={errors?.Port ?? null}
                        value={server.sshPort}
                    />
                    <Input
                        type={'text'}
                        className={classNames(style.startup_command_input)}
                        placeholder={t('Стартовая команда')}
                        icon={<ScriptIcon width={20} height={20}/>}
                        errors={errors?.StartupCommand ?? null}
                        value={server.startupCommand}
                    />
                </div>
            </FormBlock>
            <FormBlock headerName={'Учетные данные'} className={classNames(style.identity_block)}>
                <Select
                    placeholder={t('Выбрать идентификатор')}
                    icon={<DoubleArrow width={19} height={19}/>}
                    errors={errors?.IdentityId ?? null}
                    selectedItem={selectedIdentity}
                >
                    {userStore.userIdentities?.map((identity) =>
                        <SelectItem
                            key={identity.identityId}
                            selectedItem={{ id: identity.identityId.toString(), title: identity.title }}
                            isSelected={selectedIdentity?.id === identity.identityId.toString()}
                        />
                    )}
                </Select>
                <Button
                    className={classNames(style.create_identity)}
                    theme={ThemeButton.PRIMARY}
                    onClick={()=> setVisibleIdentity(true)}
                >
                    {t('Создать учетку')}
                </Button>
            </FormBlock>
            <FormBlock headerName={'Прокси'} className={classNames(style.proxy_block)}>
                <Select
                    placeholder={t('Выбрать прокси')}
                    icon={<DoubleArrow width={19} height={19}/>}
                    errors={errors?.ProxyId ?? null}
                    selectedItem={selectedProxy}
                >
                    {userStore.userProxies?.map((proxy) =>
                        <SelectItem
                            key={proxy.proxyId}
                            selectedItem={{ id: proxy.proxyId.toString(), title: proxy.title }}
                            isSelected={selectedProxy?.id === proxy.proxyId.toString()}
                        />
                    )}
                </Select>
                <Button
                    className={classNames(style.create_proxy)}
                    theme={ThemeButton.PRIMARY}
                    onClick={()=> setVisibleProxy(true)}
                >
                    {t('Создать прокси сервер')}
                </Button>
            </FormBlock>
        </Sidebar>
    );
}

export default observer(SidebarEditHost);