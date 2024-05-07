import { classNames } from 'shared/lib/classNames/classNames';
import style from './SettingsPage.module.scss';
import {observer} from "mobx-react-lite";
import {ThemeSwitcher} from "features/ThemeSwitcher";
import {LangSwitcher} from "features/LangSwitcher";
import {SettingBlock} from "features/SettingBlock";

interface SettingsPageProps {
    className?: string;
}

function SettingsPage ({ className }: SettingsPageProps) {
    return (
        <div className={classNames(style.SettingsPage, {}, [className])}>
            <div className={classNames(style.setting_inner)}>
                <SettingBlock headerName={'Accont'}>
                    
                </SettingBlock>
            </div>
		</div>
    );
}

export default observer(SettingsPage)