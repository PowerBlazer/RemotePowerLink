import { classNames } from 'shared/lib/classNames/classNames';
import style from './Input.module.scss';
import { InputHTMLAttributes, ReactNode } from 'react';
import { ErrorLabel } from 'shared/ui/ErrorLabel';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactNode,
    errors?: string[]
}

export function Input ({ className, icon, errors, ...otherProps }: InputProps) {
    return (
        <div className={classNames(style.input_inner)}>

            <div className={classNames(style.input_block, {}, [className])}>
                {icon && <div className={classNames(style.icon)}>{icon}</div> }
                <input
                    className={classNames(style.input, {
                        [style.icon_input]: Boolean(icon),
                        [style.error]: Boolean(errors)
                    }, [])}
                    {...otherProps}
                />
            </div>
            {errors && <ErrorLabel errors={errors} className={classNames(style.error_label)}/>}
        </div>
    )
}
