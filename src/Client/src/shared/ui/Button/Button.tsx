import {ButtonHTMLAttributes, LegacyRef} from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import style from './Button.module.scss';

export enum ThemeButton {
    CLEAR = 'clear'
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string,
    theme?: ThemeButton
}

export function Button (props: ButtonProps) {
    const {
        className,
        children,
        theme,
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
