import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import {MenuOptionProp} from "features/SftpMenuOptions";

interface DownloadProps extends MenuOptionProp {
    className?: string;
}

export function Download ({ className }: DownloadProps) {
    return (
        <div className={classNames(style.download, {}, [className])}>
        
		</div>
    );
}