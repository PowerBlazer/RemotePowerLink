import { ThemeSwitcher } from 'features/ThemeSwitcher';
import { useTranslation } from 'react-i18next';
import { LangSwitcher } from 'features/LangSwitcher';
import { classNames } from 'shared/lib/classNames/classNames';
import style from './MainPage.module.scss';
import { NavbarHosts } from 'widgets/NavbarHosts';

export default function MainPage () {
    const { t } = useTranslation();

    return (
        <div className={classNames(style.main_page)}>
            <NavbarHosts/>
        </div>
    );
}
