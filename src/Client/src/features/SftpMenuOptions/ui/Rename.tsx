import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import {MenuOptionProp} from "features/SftpMenuOptions";

interface RenameProps extends MenuOptionProp {
    className?: string;
}

export function Rename ({ className }: RenameProps) {
    return (
        <div className={classNames(style.rename, {}, [className])}>
        
		</div>
    );
}