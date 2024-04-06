import {ButtonHTMLAttributes, forwardRef, LegacyRef, MutableRefObject} from 'react';
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



export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    function ButtonRef (props: ButtonProps, ref: MutableRefObject<HTMLButtonElement>) {
        const {
            className,
            children,
            theme = ThemeButton.CLEAR,
            disabled,
            ...otherProps
        } = props;

        return (
            <button
                ref={ref}
                className={classNames(style.button, {
                    [style.disabled]: disabled
                }, [className, style[theme]])}
                {...otherProps}
            >
                {children}
            </button>
        )
    }
)


