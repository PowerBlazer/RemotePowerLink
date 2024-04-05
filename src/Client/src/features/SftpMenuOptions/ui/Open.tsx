import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import {MenuOptionProp} from "features/SftpMenuOptions";

interface OpenProps extends MenuOptionProp{
    className?: string;
}

export function Open ({ className }: OpenProps) {
    return (
        <div className={classNames(style.open, {}, [className])}>
        
		</div>
    );
}