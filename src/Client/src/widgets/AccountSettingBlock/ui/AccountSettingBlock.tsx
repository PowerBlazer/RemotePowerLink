import { classNames } from 'shared/lib/classNames/classNames';
import style from './AccountSettingBlock.module.scss';
import { observer } from 'mobx-react-lite';
import { SettingBlock } from 'features/SettingBlock';
import userStore from 'app/store/userStore';
import { Loader } from 'shared/ui/Loader/Loader';
import { Button, ThemeButton } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { AuthorizationService } from 'app/services/AuthorizationService/authorizationService';
import { AppRoutes } from 'app/providers/router/config/routeConfig';

interface AccountSettingBlockProps {
    className?: string;
}

function AccountSettingBlock ({ className }: AccountSettingBlockProps) {
    const { t } = useTranslation('translation');

    const emailChangeHandler = () => {

    }

    const usernameChangeHandler = () => {

    }

    const logoutHandler = () => {
        AuthorizationService.logout();

        location.pathname = AppRoutes.LOGIN;
    }

    return (
        <SettingBlock
            headerName={'Account'}
            className={classNames(style.accountSettingBlock, { [style.load]: userStore.isLoadData }, [className])}
        >
            {userStore.isLoadData && <Loader className={classNames(style.loader)}/>}
            <div className={classNames(style.email_setting, {}, [style.setting_row])}>
                <div className={classNames(style.email_label, {}, [style.label])}>
                    <div className={classNames(style.header)}>{t('Почта')}:</div>
                    <p>
                        {userStore.userData?.email}
                        {userStore.userData?.emailConfirmed && ` (${t('Подтвержден')})`}
                    </p>
                </div>
                <Button className={classNames(style.button_change)} onClick={emailChangeHandler}>
                    {t('Изменить')}
                </Button>
            </div>

            <div className={classNames(style.username_setting, {}, [style.setting_row])}>
                <div className={classNames(style.username_label, {}, [style.label])}>
                    <div className={classNames(style.header)}>{t('Имя пользователя')}:</div>
                    <p>
                        {userStore.userData?.username}
                    </p>
                </div>
                <Button className={classNames(style.button_change)} onClick={usernameChangeHandler}>
                    {t('Изменить')}
                </Button>
            </div>

            <div className={classNames(style.telephone_number_setting, {}, [style.setting_row])}>
                <div className={classNames(style.telephone_number_label, {}, [style.label])}>
                    <div className={classNames(style.header)}>{t('Номер телефона')}:</div>
                    <p>
                        {userStore.userData?.phoneNumber ?? t('Не указан')}
                    </p>
                </div>
                <Button className={classNames(style.button_change)} onClick={usernameChangeHandler}>
                    {t('Изменить')}
                </Button>
            </div>
            <div className={classNames(style.tools_panel)}>
                <Button
                    className={classNames(style.logout, {}, [style.tool_button])}
                    theme={ThemeButton.PRIMARY}
                    onClick={logoutHandler}
                >
                    {t('Выйти из системы')}
                </Button>

                <Button
                    className={classNames(style.logout, {}, [style.tool_button])}
                    theme={ThemeButton.PRIMARY}
                >
                    {t('Выйти из системы со всех устройств')}
                </Button>
                
                <Button
                    className={classNames(style.delete_account, {}, [style.tool_button])}
                    theme={ThemeButton.PRIMARY}
                >
                    {t('Удалить аккаунт')}
                </Button>

                <Button
                    className={classNames(style.change_password, {}, [style.tool_button])}
                    theme={ThemeButton.PRIMARY}
                    onClick={() => userStore.settingsModalOptions.passwordState = true }
                >
                    {t('Изменить пароль')}
                </Button>
            </div>
        </SettingBlock>
    );
}

export default observer(AccountSettingBlock);
