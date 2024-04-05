import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import {MenuOptionProp} from "features/SftpMenuOptions";

interface NewFolderProps extends MenuOptionProp {
    className?: string;
}

export function NewFolder ({ className }: NewFolderProps) {
    return (
        <div className={classNames(style.newFolder, {}, [className])}>
        
		</div>
    );
}