import { classNames } from 'shared/lib/classNames/classNames';
import style from './SettingsPage.module.scss';
import { observer } from 'mobx-react-lite';
import { SettingBlock } from 'features/SettingBlock';
import { useTranslation } from 'react-i18next';
import { ThemeSwitcher } from 'features/ThemeSwitcher';
import { LangSwitcher } from 'features/LangSwitcher';
import { AccountSettingBlock } from 'widgets/AccountSettingBlock';
import userStore from "app/store/userStore";
import { PasswordModal } from "widgets/SettingModals/PasswordModal";

interface SettingsPageProps {
    className?: string;
}

function SettingsPage ({ className }: SettingsPageProps) {
    const { t } = useTranslation('translation');

    return (
        <div className={classNames(style.settingsPage, {}, [className])}>
            <div className={classNames(style.setting_inner)}>
                <AccountSettingBlock/>

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
            </div>
            { userStore.settingsModalOptions.passwordState && <PasswordModal/> }
            
        </div>
    );
}

export default observer(SettingsPage)
