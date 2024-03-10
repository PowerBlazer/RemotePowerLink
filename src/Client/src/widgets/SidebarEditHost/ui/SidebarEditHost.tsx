import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarEditHost.module.scss';
import {observer} from "mobx-react-lite";
import {Sidebar, SidebarOptions} from "widgets/Sidebar";
import {useTranslation} from "react-i18next";
import {ChangeEvent, useCallback, useMemo, useState} from "react";
import sidebarStore from "app/store/sidebarStore";
import {SidebarNewProxy} from "widgets/SidebarNewProxy";
import {SidebarNewIdentity} from "widgets/SidebarNewIdentity";
import {CreateProxyResult} from "app/services/ProxyService/config/proxyConfig";
import userStore from "app/store/userStore";
import {CreateIdentityResult} from "app/services/IdentityService/config/identityConfig";
import {EditServerData, EditServerResult} from "app/services/ServerService/config/serverConfig";
import {Select, SelectedItem, SelectItem} from "shared/ui/Select";
import {FormBlock} from "features/FormBlock";
import ServerIcon from "shared/assets/icons/navbar/server2.svg";
import {Input} from "shared/ui/Input";
import TitleIcon from "shared/assets/icons/title.svg";
import PortIcon from "shared/assets/icons/code-working.svg";
import ScriptIcon from "shared/assets/icons/curly-braces.svg";
import DoubleArrow from "shared/assets/icons/double-arrow.svg";
import {Button, ThemeButton} from "shared/ui/Button/Button";
import {ButtonLoader} from "shared/ui/ButtonLoader";
import {ServerService} from "app/services/ServerService/serverService";

interface SidebarEditHostProps extends SidebarOptions<EditServerResult>{
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
    const identity = userStore.userIdentities.find(p=> p.identityId === server.identityId);
    const proxy = userStore.userProxies.find(p=> p.proxyId === server.proxyId);
    
    const { t } = useTranslation('translation');
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    
    const [serverData, setServerData] = useState<EditServerData>({
        serverId: server.serverId,
        title: server.title,
        hostname: server.hostname,
        identityId: server.identityId,
        proxyId: server.proxyId,
        sshPort: server.sshPort?.toString(),
        startupCommand: server.startupCommand
    });
    
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
            title: createIdentityResult.title,
            username: createIdentityResult.username
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

    const selectProxyHandler = (selectedItem?: SelectedItem) => {
        if (!selectedItem) {
            setServerData(prevData => ({
                ...prevData,
                proxyId: null
            }));

            setErrors(prevValue => {
                const updatedErrors = { ...prevValue };
                delete updatedErrors.ProxyId;
                return updatedErrors;
            });

            setProxy(null);

            return;
        }

        setProxy(selectedItem);

        setServerData(prevData => ({
            ...prevData,
            proxyId: Number(selectedItem.id)
        }));

        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors.ProxyId;
            return updatedErrors;
        });
    }

    const selectIdentityHandler = (selectedItem?: SelectedItem) => {
        if (!selectedItem) {
            setServerData(prevData => ({
                ...prevData,
                identityId: 0
            }));

            setErrors(prevValue => {
                const updatedErrors = { ...prevValue };
                delete updatedErrors.IdentityId;
                return updatedErrors;
            });

            setIdentity(null)

            return;
        }

        setIdentity(selectedItem)

        setServerData(prevData => ({
            ...prevData,
            identityId: Number(selectedItem.id)
        }));

        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors.IdentityId;
            return updatedErrors;
        });
    }

    const hostnameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setServerData(prevData => ({
            ...prevData,
            hostname: e.target.value
        }));

        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors.Hostname;
            return updatedErrors;
        });
    }

    const nameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setServerData(prevData => ({
            ...prevData,
            title: e.target.value
        }));

        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors.Title;
            return updatedErrors;
        });
    }

    const portChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const port = parseInt(e.target.value, 10);

        setServerData(prevData => ({
            ...prevData,
            sshPort: e.target.value
        }));

        if (!isNaN(port) || e.target.value.length === 0) {
            setErrors(prevValue => {
                const updatedErrors = { ...prevValue };
                delete updatedErrors.Port;
                return updatedErrors;
            });
        } else {
            setErrors(prevValue => ({
                ...prevValue,
                Port: ['Некорректно веден порт']
            }));
        }
    }

    const startupCommandChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setServerData(prevData => ({
            ...prevData,
            startupCommand: e.target.value
        }));

        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors.StartupCommand;
            return updatedErrors;
        });
    }

    const saveServerClickHandler = useCallback(async () => {
       
        const editServerResult = await ServerService.editServer(serverData);

        if (onSave && editServerResult.isSuccess) {
            await onSave(editServerResult.result);
        }

        if (!editServerResult.isSuccess) {
            setErrors(editServerResult?.errors);
        }
    },[serverData]);
    
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

    const footerPanel = useMemo(() => {
        return (
            <div className={classNames(style.save_block)}>
                <ButtonLoader
                    className={classNames(style.save_host)}
                    theme={ThemeButton.PRIMARY}
                    disabled={Object.keys(errors).length > 0}
                    actionAsync={saveServerClickHandler}
                >
                    {t('Сохранить сервер')}
                </ButtonLoader>
            </div>
        )
    }, [saveServerClickHandler]);
    
    return (
        <Sidebar
            className={classNames(style.sidebarEditHost, {}, [className])}
            headerName={'Редактирование сервера'}
            close={closeHandler}
            sidebars={sidebars}
            footer={footerPanel}
            isMain={isMain}
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
                        errors={errors?.Hostname ?? null}
                        value={serverData.hostname}
                        onChange={hostnameChangeHandler}
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
                        value={serverData.title}
                        onChange={nameChangeHandler}
                    />
                    <Input
                        type={'text'}
                        className={classNames(style.port_input)}
                        placeholder={t('Ssh порт')}
                        icon={<PortIcon width={20} height={20}/>}
                        errors={errors?.Port ?? null}
                        value={serverData.sshPort ?? ""}
                        onChange={portChangeHandler}
                    />
                    <Input
                        type={'text'}
                        className={classNames(style.startup_command_input)}
                        placeholder={t('Стартовая команда')}
                        icon={<ScriptIcon width={20} height={20}/>}
                        errors={errors?.StartupCommand ?? null}
                        value={serverData.startupCommand ?? ""}
                        onChange={startupCommandChangeHandler}
                    />
                </div>
            </FormBlock>
            <FormBlock headerName={'Учетные данные'} className={classNames(style.identity_block)}>
                <Select
                    placeholder={t('Выбрать идентификатор')}
                    icon={<DoubleArrow width={19} height={19}/>}
                    errors={errors?.IdentityId ?? null}
                    selectedItem={selectedIdentity}
                    onChange={selectIdentityHandler}
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
                    onChange={selectProxyHandler}
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