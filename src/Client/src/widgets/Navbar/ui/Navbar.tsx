import { useTranslation } from 'react-i18next';
import { classNames } from 'shared/lib/classNames/classNames';
import style from './Navbar.module.scss';
import { ThemeSwitcher } from 'features/ThemeSwitcher';
import { LangSwitcher } from 'features/LangSwitcher';

interface NavbarProps {
    className?: string
}

export function Navbar ({ className }: NavbarProps) {
    return (
        <div className={classNames(style.navbar, {}, [className])}>
            
        </div>
    )
}
