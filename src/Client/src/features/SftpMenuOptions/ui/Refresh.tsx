import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import {MenuOptionProp} from "features/SftpMenuOptions";

interface RefreshProps extends MenuOptionProp {
    className?: string;
}

export function Refresh ({ className }: RefreshProps) {
    return (
        <div className={classNames(style.refresh, {}, [className])}>
        
		</div>
    );
}