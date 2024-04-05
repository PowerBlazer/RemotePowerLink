import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import {MenuOptionProp} from "features/SftpMenuOptions";

interface UnloadProps extends MenuOptionProp {
    className?: string;
}

export function Unload ({ className }: UnloadProps) {
    return (
        <div className={classNames(style.unload, {}, [className])}>
        
		</div>
    );
}