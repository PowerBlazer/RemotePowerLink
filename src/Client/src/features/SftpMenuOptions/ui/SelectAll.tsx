import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import {MenuOptionProp} from "features/SftpMenuOptions";

interface SelectAllProps extends MenuOptionProp {
    className?: string;
}

export function SelectAll ({ className }: SelectAllProps) {
    return (
        <div className={classNames(style.selectAll, {}, [className])}>
        
		</div>
    );
}