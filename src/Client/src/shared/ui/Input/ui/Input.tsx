import { classNames } from 'shared/lib/classNames/classNames';
import style from './Input.module.scss';
import {InputHTMLAttributes, ReactNode} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?:ReactNode
}

export function Input ({ className, icon, ...otherProps }: InputProps) {
    return (
        <div className={classNames(style.input_block,{},[className])}>
            {icon && <div className={classNames(style.icon)}>{icon}</div> }
            <input className={classNames(style.input, {[style.icon_input]: Boolean(icon)}, [])} {...otherProps} />
        </div>

    )
}