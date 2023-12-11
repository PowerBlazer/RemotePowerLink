import { useTranslation } from 'react-i18next';
import { classNames } from 'shared/lib/classNames/classNames';
import { IDropDownPanelConfig, DropDownPanelPosition, IDropDownPanelButtonConfig, ThemeDropDownPanel } from 'shared/ui/DropdownPanel/types/DropdownPanelTypes';
import style from './Navbar.module.scss';
import DropDownPanelItem from 'shared/ui/DropdownPanel/ui/DropDownPanelItem';
import DropDownPanel from 'shared/ui/DropdownPanel/ui/DropDownPanel';
import BurgerMenuIcon from '../assets/burger-menu-svgrepo-com.svg'
import { useTheme } from 'app/providers/ThemeProvider';
import { ThemeSwitcher } from 'features/ThemeSwitcher';

interface NavbarProps {
    className?: string
}

export function Navbar ({ className }: NavbarProps) {
    const { t } = useTranslation();

    return (
        <div className={classNames(style.navbar, {}, [className])}>
            <ThemeSwitcher />
        </div>
    )
}
