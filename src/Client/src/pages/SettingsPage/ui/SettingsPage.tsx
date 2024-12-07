import { classNames } from 'shared/lib/classNames/classNames';
import { observer } from 'mobx-react-lite';
import { SettingBlock } from 'features/SettingBlock';
import { useTranslation } from 'react-i18next';
import { ThemeSwitcher } from 'features/ThemeSwitcher';
import { LangSwitcher } from 'features/LangSwitcher';
import { AccountSettingBlock } from 'widgets/SettingBlocks/AccountSettingBlock';
import userStore from 'app/store/userStore';
import { PasswordModal } from 'widgets/SettingModals/PasswordModal';
import { UsernameModal } from 'widgets/SettingModals/UsernameModal';
import { PhoneNumberModal } from 'widgets/SettingModals/PhoneNumberModal';
import { EmailModal } from 'widgets/SettingModals/EmailModal';
import style from './SettingsPage.module.scss';
import { Button } from 'shared/ui/Button/Button';
import { Input } from 'shared/ui/Input';
import terminalStore from 'app/store/terminalStore';
import { useMemo } from 'react';
import { TerminalSettingBlock } from 'widgets/SettingBlocks/TerminalSettingBlock';
import { Loader } from 'shared/ui/Loader/Loader';

interface SettingsPageProps {
    className?: string;
}

function SettingsPage ({ className }: SettingsPageProps) {
    const { t } = useTranslation('translation');

    return (
        <div className={classNames(style.settingsPage, {}, [className])}>
            {
                userStore.isLoadData
                    ? <Loader className={classNames(style.loader)}/>
                    : <div className={classNames(style.setting_inner)}>
                        <SettingBlock className={classNames(style.general_block)} headerName={t('Главная')}>
                            <div className={classNames(style.theme_switcher, {}, [style.general_row])}>
                                {t('Тема')}
                                <ThemeSwitcher/>
                            </div>
                            <div className={classNames(style.language_switcher, {}, [style.general_row])}>
                                {t('Язык')}
                                <LangSwitcher/>
                            </div>
                        </SettingBlock>
                        <AccountSettingBlock/>
                        <TerminalSettingBlock/>
                    </div>
            }
            { userStore.settingsModalOptions.passwordState && <PasswordModal/> }
            { userStore.settingsModalOptions.usernameState && <UsernameModal/> }
            { userStore.settingsModalOptions.phoneNumberState && <PhoneNumberModal/> }
            { userStore.settingsModalOptions.emailState && <EmailModal/> }

        </div>
    );
}

export default observer(SettingsPage)
