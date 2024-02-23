import {ButtonHTMLAttributes, LegacyRef} from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import style from './Button.module.scss';

export enum ThemeButton {
    CLEAR = 'clear',
    PRIMARY = 'primary'
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string,
    theme?: ThemeButton
}

export function Button (props: ButtonProps) {
    const {
        className,
        children,
        theme = ThemeButton.CLEAR,
        ...otherProps
    } = props;

    return (
        <button
            className={classNames(style.button, {}, [className, style[theme]])}
            {...otherProps}
        >
            {children}
        </button>
    )
}
