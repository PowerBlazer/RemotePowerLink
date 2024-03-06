import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarEditProxy.module.scss';
import {observer} from "mobx-react-lite";
import {Sidebar, SidebarOptions} from "widgets/Sidebar";
import { EditProxyData, EditProxyResult} from "app/services/ProxyService/config/proxyConfig";
import {ChangeEvent, useCallback, useMemo, useState} from "react";
import {Select, SelectedItem, SelectItem} from "shared/ui/Select";
import sidebarStore from "app/store/sidebarStore";
import userStore from "app/store/userStore";
import {ProxyService} from "app/services/ProxyService/proxyService";
import {CreateIdentityResult} from "app/services/IdentityService/config/identityConfig";
import SidebarNewIdentity from "widgets/SidebarNewIdentity/ui/SidebarNewIdentity";
import {ButtonLoader} from "shared/ui/ButtonLoader";
import {Button, ThemeButton} from "shared/ui/Button/Button";
import {useTranslation} from "react-i18next";
import {FormBlock} from "features/FormBlock";
import ServerIcon from "shared/assets/icons/navbar/server2.svg";
import {Input} from "shared/ui/Input";
import TitleIcon from "shared/assets/icons/title.svg";
import PortIcon from "shared/assets/icons/code-working.svg";
import DoubleArrow from "shared/assets/icons/double-arrow.svg";

interface SidebarEditProxyProps extends SidebarOptions<EditProxyResult>{
    className?: string;
}

function SidebarEditProxy (props: SidebarEditProxyProps) {
    const {
        className,
        isMain = false,
        onSave,
        onClose,
        isVisible
    } = props;
    
    const proxy = sidebarStore.editProxyData.proxy;
    const identity = userStore.userIdentities.find(p=>p.identityId === proxy.identityId);

    const { t } = useTranslation('translation');
    
    const [proxyData, setProxyData] = useState<EditProxyData>({
        proxyId: proxy.proxyId,
        title: proxy.title,
        hostname: proxy.hostname,
        identityId:proxy.identityId,
        sshPort: proxy.sshPort.toString()
    });
    
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const [selectedIdentity, setIdentity] = useState<SelectedItem>({
        id:identity.identityId.toString(),
        title:identity.title
    });
    
    const [isVisibleIdentity, setVisibleIdentity] = useState<boolean>(false);

    const closeHandler = async () => {
        if (onClose) {
            onClose()
        }

        if (!isMain) {
            sidebarStore.newProxyData.isVisible = false;
        }
    }

    const selectIdentityHandler = (selectedItem?: SelectedItem) => {
        if (!selectedItem) {
            setProxyData(prevData => ({
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
        
        setIdentity({ id: selectedItem.id, title: selectedItem.title });

        setProxyData(prevData => ({
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
        setProxyData(prevData => ({
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
        setProxyData(prevData => ({
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

        setProxyData(prevData => ({
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

    const saveProxyClickHandler = useCallback(async () => {
        const editProxyResult = await ProxyService.editProxy(proxyData);

        if (onSave && editProxyResult.isSuccess) {
            await onSave(editProxyResult.result);
        }

        if (!editProxyResult.isSuccess) {
            setErrors(editProxyResult?.errors);
        }
    },[proxyData])

    const createIdentityOnSaveHandler = async (createIdentityResult: CreateIdentityResult) => {
        userStore.setUserIdentity({
            title:createIdentityResult.title,
            identityId: createIdentityResult.identityId
        })

        setVisibleIdentity(false);

        setIdentity({ id: createIdentityResult.identityId.toString(), title: createIdentityResult.title });

        setProxyData(prevData => ({
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
        <SidebarNewIdentity
            key="identity"
            isMain={false}
            isVisible={isVisibleIdentity}
            onSave={createIdentityOnSaveHandler}
            onClose={() => setVisibleIdentity(false)}
        />
    ], [isVisibleIdentity]);

    const footerPanel = useMemo(() => {
        return (
            <div className={classNames(style.save_block)}>
                <ButtonLoader
                    className={classNames(style.edit_proxy)}
                    theme={ThemeButton.PRIMARY}
                    actionAsync={saveProxyClickHandler}
                    disabled={Object.keys(errors).length > 0}
                >
                    {t('Сохранить прокси-сервер')}
                </ButtonLoader>
            </div>
        )
    }, [saveProxyClickHandler])
    
    return (
        <Sidebar
            className={classNames(style.sidebarNewProxy, {
                [style.active]: ((sidebarStore.editProxyData?.isVisible || isVisible) && !isMain)
            }, [className])}
            sidebars={sidebars}
            footer={footerPanel}
            headerName={'Редактирование прокси-сервера'}
            close={closeHandler}
            isLoad={userStore.isLoadData}
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
                        value={proxyData?.hostname ?? ""}
                        errors={errors?.Hostname ?? null}
                    />
                </div>
            </FormBlock>
            <FormBlock className={classNames(style.general_block)} headerName={'Главная'}>
                <div className={classNames(style.general_block)}>
                    <Input
                        type={'text'}
                        className={classNames(style.title_input)}
                        placeholder={t('Название')}
                        icon={<TitleIcon width={20} height={20}/>}
                        onChange={nameChangeHandler}
                        errors={errors?.Title ?? null}
                        value={proxyData?.title ?? ""}
                    />
                    <Input
                        type={'text'}
                        className={classNames(style.port_input)}
                        placeholder={t('Ssh порт')}
                        icon={<PortIcon width={20} height={20}/>}
                        onChange={portChangeHandler}
                        errors={errors?.Port ?? null}
                        value={proxyData?.sshPort ?? ""}
                    />
                </div>
            </FormBlock>
            <FormBlock className={classNames(style.identity_block)} headerName={'Учетные данные'}>
                <Select
                    placeholder={'Выбрать учетку'}
                    icon={<DoubleArrow width={19} height={19}/>}
                    onChange={selectIdentityHandler}
                    errors={errors?.IdentityId ?? null}
                    selectedItem={selectedIdentity}
                >
                    {userStore.userIdentities?.map((identity) =>
                        <SelectItem
                            key={identity.identityId}
                            selectedItem={{ id: identity.identityId.toString(), title: identity.title }}
                            isSelected={selectedIdentity?.id === identity.identityId.toString() }
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

export default observer(SidebarEditProxy)