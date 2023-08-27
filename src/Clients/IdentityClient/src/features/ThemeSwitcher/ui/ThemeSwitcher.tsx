import { classNames } from 'shared/lib/classNames/classNames';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import { Button, ThemeButton } from 'shared/ui/Button/Button';
import LightIcon from 'shared/assets/icons/sun.svg';
import DarkIcon from 'shared/assets/icons/moon.svg';
import style from './ThemeSwitcher.module.scss';

interface ThemeSwitcherProps {
    className?: string
}

export function ThemeSwitcher (props: ThemeSwitcherProps) {
    const {
        className
    } = props;

    const { toggleTheme, theme } = useTheme();

    return (
        <Button
            className={classNames(style.themeSwitcher, {}, [className])}
            onClick={toggleTheme}
            theme={ThemeButton.CLEAR}
        >
            {theme === Theme.LIGHT ? <LightIcon fill='#FFC300'/> : <DarkIcon fill='#FFF' color='#061DD1'/>}
        </Button>
    )
}
