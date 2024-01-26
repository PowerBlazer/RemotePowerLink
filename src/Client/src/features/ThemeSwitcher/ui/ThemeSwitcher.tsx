import { classNames } from 'shared/lib/classNames/classNames';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { Theme } from 'shared/lib/Theme/ThemeContext';
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
        <div className={classNames(style.toggleWrapper, {}, [className])}>
            <input
                type="checkbox"
                className={style.dn}
                id="dn"
                checked={
                    theme !== Theme.LIGHT
                }
                onChange={toggleTheme}
            />
            <label htmlFor="dn" className={style.toggle}>
                <span className={style.toggle__handler}>
                    <span className={classNames(style.crater, {}, [style.crater__1])}></span>
                    <span className={classNames(style.crater, {}, [style.crater__2])}></span>
                    <span className={classNames(style.crater, {}, [style.crater__3])}></span>
                </span>
                <span className={classNames(style.star, {}, [style.star__1])}></span>
                <span className={classNames(style.star, {}, [style.star__2])}></span>
                <span className={classNames(style.star, {}, [style.star__3])}></span>
                <span className={classNames(style.star, {}, [style.star__4])}></span>
                <span className={classNames(style.star, {}, [style.star__5])}></span>
                <span className={classNames(style.star, {}, [style.star__6])}></span>
            </label>
        </div>
    )
}
