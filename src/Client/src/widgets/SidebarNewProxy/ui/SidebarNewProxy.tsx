import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarNewProxy.module.scss';
import { observer } from 'mobx-react-lite';
import { Sidebar, SidebarOptions } from 'widgets/Sidebar';
import sidebarStore from 'app/store/sidebarStore';
import { Button, ThemeButton } from 'shared/ui/Button/Button';
import { useEffectLoad } from 'app/hooks/useLoad';
import { IdentityService } from 'app/services/IdentityService/identityService';
import { ProxyService } from 'app/services/ProxyService/proxyService';
import { FormBlock } from 'features/FormBlock';
import { Select, SelectedItem, SelectItem } from 'shared/ui/Select';
import DoubleArrow from 'shared/assets/icons/double-arrow.svg';
import { useTranslation } from 'react-i18next';
import ServerIcon from 'shared/assets/icons/navbar/server2.svg';
import { Input } from 'shared/ui/Input';
import TitleIcon from 'shared/assets/icons/title.svg';
import PortIcon from 'shared/assets/icons/code-working.svg';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import SidebarNewIdentity from 'widgets/SidebarNewIdentity/ui/SidebarNewIdentity';
import { CreateProxyData, CreateProxyResult } from 'app/services/ProxyService/config/proxyConfig';
import { ButtonLoader } from 'shared/ui/ButtonLoader';
import { CreateIdentityResult } from 'app/services/IdentityService/config/identityConfig';
import userStore from 'app/store/userStore';

interface SidebarNewProxyProps extends SidebarOptions<CreateProxyResult> {
    className?: string;
    selectedIdentity?: SelectedItem
}

const defaultProxyData: CreateProxyData = {
    title: '',
    identityId: 0,
    hostname: ''
}

function SidebarNewProxy ({ className, isMain = true, onSave, onClose, isVisible }: SidebarNewProxyProps) {
    const { t } = useTranslation('translation');
    const [proxyData, setProxyData] = useState<CreateProxyData>(defaultProxyData);
    const [errors, setErrors] = useState<Record<string, string[]> | undefined>({});

    const [selectedIdentity, setIdentity] = useState<SelectedItem | undefined>(undefined);
    const [isVisibleIdentity, setVisibleIdentity] = useState<boolean>(false);

    const closeHandler = async () => {
        if (onClose) {
            onClose()
        }

        if (!isMain) {
            sidebarStore.newProxyData.isVisible = false;
        }
    }

    const createIdentityHandler = () => {
        setVisibleIdentity(true);
    }

    const closeIdentityHandler = () => {
        setVisibleIdentity(false);
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

            setIdentity(undefined)

            return;
        }

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

        if (!isNaN(port) || e.target.value.length === 0) {
            setProxyData(prevData => ({
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

    const createProxyClickHandler = useCallback(async () => {
        const createProxyResult = await ProxyService.createProxy(proxyData);

        if (onSave && createProxyResult.isSuccess) {
            await onSave(createProxyResult.result);
        }

        if (!createProxyResult.isSuccess) {
            setErrors(createProxyResult?.errors);
        }
    }, [proxyData])

    const createIdentityOnSaveHandler = async (createIdentityResult: CreateIdentityResult) => {
        userStore.setUserIdentity({
            title: createIdentityResult.title,
            identityId: createIdentityResult.identityId,
            username: createIdentityResult.username,
            dateCreated: createIdentityResult.dateCreated
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
            onClose={closeIdentityHandler}
        />
    ], [isVisibleIdentity]);

    const footerPanel = useMemo(() => {
        return (
            <div className={classNames(style.save_block)}>
                <ButtonLoader
                    className={classNames(style.create_newhost)}
                    theme={ThemeButton.PRIMARY}
                    actionAsync={createProxyClickHandler}
                    disabled={Object.keys(errors).length > 0}
                >
                    {t('Создать прокси сервер')}
                </ButtonLoader>
            </div>
        )
    }, [createProxyClickHandler])

    return (
        <Sidebar
            className={classNames(style.sidebarNewProxy, {
                [style.active]: ((sidebarStore.newProxyData?.isVisible || isVisible) && !isMain)
            }, [className])}
            sidebars={sidebars}
            footer={footerPanel}
            headerName={'Новый прокси сервер'}
            close={closeHandler}
            isLoad={userStore.isLoadData}
            isMain={isMain}

        >
            <FormBlock headerName={'Адрес'}>
                <div className={classNames(style.address_block)}>
                    <div className={classNames(style.icon_server)}>
                        <ServerIcon width={24} height={24}/>
                    </div>
                    <Input
                        type={'text'}
                        className={style.address_input}
                        placeholder={t('IP или домен')}
                        onChange={hostnameChangeHandler}
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
                    />
                    <Input
                        type={'text'}
                        className={classNames(style.port_input)}
                        placeholder={t('Ssh порт')}
                        icon={<PortIcon width={20} height={20}/>}
                        onChange={portChangeHandler}
                        errors={errors?.Port ?? null}
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
                    onClick={createIdentityHandler}
                >
                    {t('Создать учетку')}
                </Button>
            </FormBlock>
        </Sidebar>
    );
}

export default observer(SidebarNewProxy);
