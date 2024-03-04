import { classNames } from 'shared/lib/classNames/classNames';
import { observer } from 'mobx-react-lite';
import { Sidebar, SidebarOptions } from 'widgets/Sidebar';
import { FormBlock } from 'features/FormBlock';
import { Input } from 'shared/ui/Input';
import { useTranslation } from 'react-i18next';
import {ChangeEvent, useCallback, useMemo, useState} from 'react';
import { Select, SelectedItem, SelectItem } from 'shared/ui/Select';
import { Button, ThemeButton } from 'shared/ui/Button/Button';
import { SidebarNewProxy } from 'widgets/SidebarNewProxy';
import { SidebarNewIdentity } from 'widgets/SidebarNewIdentity';
import {CreateServerData, ServerData} from 'services/ServerService/config/serverConfig';
import { ButtonLoader } from 'shared/ui/ButtonLoader';
import { ServerService } from 'services/ServerService/serverService';
import { CreateProxyResult } from 'services/ProxyService/config/proxyConfig';
import { CreateIdentityResult } from 'services/IdentityService/config/identityConfig';
import ServerIcon from 'shared/assets/icons/navbar/server2.svg';
import TitleIcon from 'shared/assets/icons/title.svg';
import PortIcon from 'shared/assets/icons/code-working.svg';
import ScriptIcon from 'shared/assets/icons/curly-braces.svg'
import DoubleArrow from 'shared/assets/icons/double-arrow.svg';
import style from './SidebarNewHost.module.scss';
import sidebarStore from 'app/store/sidebarStore';
import userStore from "app/store/userStore";

interface SidebarNewHostProps extends SidebarOptions<ServerData> {
    className?: string;
}

const defaultServerValue = {
    hostname: '',
    title: '',
    identityId: 0
}

function SidebarNewHost ({ className, isMain = false, onSave, onClose }: SidebarNewHostProps) {
    const { t } = useTranslation('translation');
    const [serverData, setServerData] = useState<CreateServerData>(defaultServerValue);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [selectedProxy, setProxy] = useState<SelectedItem>(null);
    const [selectedIdentity, setIdentity] = useState<SelectedItem>(null);

    const [isVisibleIdentity, setVisibleIdentity] = useState<boolean>(false);
    const [isVisibleProxy, setVisibleProxy] = useState<boolean>(false);
    const closeHandler = async () => {
        if (onClose) {
            onClose();
        }

        if (!isMain) {
            sidebarStore.newHostData.isVisible = false;
        }
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

        if (!isNaN(port) || e.target.value.length === 0) {
            setServerData(prevData => ({
                ...prevData,
                sshPort: port
            }));

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

    const createServerClickHandler = useCallback(async () => {
        const createServerResult = await ServerService.createServer(serverData);

        if (onSave && createServerResult.isSuccess) {
            await onSave(createServerResult.result);
        }

        if (!createServerResult.isSuccess) {
            setErrors(createServerResult?.errors);
        }
    },[serverData]);

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
    
    const footerPanel = useMemo(() => {
        return (
            <div className={classNames(style.save_block)}>
                <ButtonLoader
                    className={classNames(style.create_newhost)}
                    theme={ThemeButton.PRIMARY}
                    disabled={Object.keys(errors).length > 0}
                    actionAsync={createServerClickHandler}
                >
                    {t('Создать сервер')}
                </ButtonLoader>
            </div>
        )
    }, [createServerClickHandler])

    return (
        <Sidebar
            className={classNames(style.sidebarNewHost, {}, [className])}
            headerName={'Новый сервер'}
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
                        onChange={hostnameChangeHandler}
                        errors={errors.Hostname ?? null}
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
                        onChange={nameChangeHandler}
                        errors={errors?.Title ?? null}
                    />
                    <Input
                        type={'text'}
                        className={classNames(style.port_input)}
                        placeholder={t('Ssh порт')}
                        icon={<PortIcon width={20} height={20}/>}
                        onChange={portChangeHandler}
                        errors={errors?.Port ?? null}
                    />
                    <Input
                        type={'text'}
                        className={classNames(style.startup_command_input)}
                        placeholder={t('Стартовая команда')}
                        icon={<ScriptIcon width={20} height={20}/>}
                        onChange={startupCommandChangeHandler}
                        errors={errors?.StartupCommand ?? null}

                    />
                </div>
            </FormBlock>
            <FormBlock headerName={'Прокси'} className={classNames(style.proxy_block)}>
                <Select
                    placeholder={t('Выбрать прокси')}
                    icon={<DoubleArrow width={19} height={19}/>}
                    onChange={selectProxyHandler}
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
            <FormBlock headerName={'Учетные данные'} className={classNames(style.identity_block)}>
                <Select
                    placeholder={t('Выбрать идентификатор')}
                    icon={<DoubleArrow width={19} height={19}/>}
                    onChange={selectIdentityHandler}
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
        </Sidebar>
    );
}

export default observer(SidebarNewHost)
