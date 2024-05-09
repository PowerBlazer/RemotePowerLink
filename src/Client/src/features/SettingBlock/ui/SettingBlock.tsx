import { classNames } from 'shared/lib/classNames/classNames';
import style from './SettingBlock.module.scss';
import { HTMLAttributes } from 'react';

interface SettingBlockProps extends HTMLAttributes<HTMLDivElement> {
    headerName: string
}

export function SettingBlock (props: SettingBlockProps) {
    const {
        className,
        headerName,
        children,
        ...otherProps
    } = props;

    return (
        <div className={classNames(style.settingBlock)} {...otherProps}>
            <div className={classNames(style.header_name)}>
                {headerName}
            </div>
            <div className={classNames(style.content, {}, [className])}>
                {children}
            </div>
        </div>
    );
}
