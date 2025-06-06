import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarEditIdentity.module.scss';
import { observer } from 'mobx-react-lite';
import { Sidebar, SidebarOptions } from 'widgets/Sidebars/Sidebar';
import {
    EditIdentityData,
    EditIdentityResult
} from 'app/services/IdentityService/config/identityConfig';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import sidebarStore from 'app/store/sidebarStore';
import { IdentityService } from 'app/services/IdentityService/identityService';
import { ButtonLoader } from 'shared/ui/ButtonLoader';
import { ThemeButton } from 'shared/ui/Button/Button';
import UserCard from 'shared/assets/icons/user-card.svg';
import { Input } from 'shared/ui/Input';
import { FormBlock } from 'features/FormBlock';
import { ButtonDelete } from 'features/SidebarModules/ButtonDelete';
import { DataTypeEnum } from 'app/enums/DataTypeEnum';
import userStore from 'app/store/userStore';
import { IdentityDataMapper } from 'app/mappers/identityDataMapper';
import toast from 'react-hot-toast';

interface SidebarEditIdentityProps extends SidebarOptions<EditIdentityResult> {
    className?: string;
}

function SidebarEditIdentity (props: SidebarEditIdentityProps) {
    const { t } = useTranslation('translation');

    const {
        className,
        isMain = true,
        onSave,
        onClose,
        isVisible
    } = props;

    const identity = sidebarStore.mainSidebar.editIdentityData.data;

    const [identityData, setIdentityData] = useState<EditIdentityData>({
        identityId: identity.identityId,
        title: identity.title,
        username: identity.username,
        password: ''
    });

    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const closeHandler = async () => {
        if (onClose) {
            onClose();
        }

        if (!isMain) {
            sidebarStore.mainSidebar.editIdentityData.isVisible = false;
        }
    }

    const nameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setIdentityData(prevData => ({
            ...prevData,
            title: e.target.value
        }));

        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors.Title;
            return updatedErrors;
        });
    }

    const usernameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setIdentityData(prevData => ({
            ...prevData,
            username: e.target.value
        }));

        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors.Username;
            return updatedErrors;
        });
    }

    const passwordChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setIdentityData(prevData => ({
            ...prevData,
            password: e.target.value
        }));

        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors.Password;
            return updatedErrors;
        });
    }

    const saveIdentityClickHandler = useCallback(async () => {
        const editIdentityResult = await IdentityService.editIdentity(identityData);

        if (editIdentityResult.isSuccess) {
            userStore.setUserIdentity(IdentityDataMapper.fromEditIdentityResult(editIdentityResult.result));

            toast.success(t('Успешно сохранено'));

            await onSave?.(editIdentityResult.result);
        }

        if (!editIdentityResult.isSuccess) {
            setErrors(editIdentityResult?.errors);
        }
    }, [identityData]);

    const footerPanel = useMemo(() => {
        return (
            <div className={classNames(style.save_block)}>
                <ButtonLoader
                    className={classNames(style.create_newhost)}
                    theme={ThemeButton.PRIMARY}
                    actionAsync={saveIdentityClickHandler}
                    disabled={Object.keys(errors).length > 0}
                >
                    {t('Сохранить идентификатор')}
                </ButtonLoader>
            </div>
        )
    }, [saveIdentityClickHandler, errors]);

    const headerTools = useMemo(() => (
        <ButtonDelete dataType={DataTypeEnum.IDENTITY} dataId={identityData.identityId} />
    ), []);

    return (
        <Sidebar
            className={classNames(style.sidebarEditIdentity, {
                [style.active]: sidebarStore.mainSidebar.newIdentityData?.isVisible || isVisible
            }, [className])}
            isMain={isMain}
            footer={footerPanel}
            headerTools={headerTools}
            headerName={'Редактировать иденитификатор'}
            close={closeHandler}
        >
            <FormBlock className={classNames(style.general_block)} headerName={'Главная'}>
                <div className={classNames(style.general_block)}>
                    <div className={classNames(style.title_block)}>
                        <div className={classNames(style.icon_server)}>
                            <UserCard width={35} height={35}/>
                        </div>
                        <Input
                            type={'text'}
                            className={style.title_input}
                            placeholder={t('Название')}
                            onChange={nameChangeHandler}
                            errors={errors.Title ?? null}
                            value={identityData.title ?? ''}
                        />
                    </div>
                    <Input
                        type={'text'}
                        className={classNames(style.username_input)}
                        placeholder={t('Имя пользователя')}
                        onChange={usernameChangeHandler}
                        errors={errors?.Username ?? null}
                        value={identityData.username ?? ''}
                    />
                    <Input
                        type={'password'}
                        className={classNames(style.username_input)}
                        placeholder={t('Пароль')}
                        onChange={passwordChangeHandler}
                        errors={errors?.Password ?? null}
                        value={identityData.password ?? ''}
                    />
                </div>
            </FormBlock>
        </Sidebar>
    );
}

export default observer(SidebarEditIdentity)
