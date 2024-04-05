import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from "features/SftpMenuOptions";

interface CloseProps extends MenuOptionProp{
    className?: string;
}

export function Close ({ className }: CloseProps) {
    return (
        <div className={classNames(style.close, {}, [className])}>
        
		</div>
    );
}