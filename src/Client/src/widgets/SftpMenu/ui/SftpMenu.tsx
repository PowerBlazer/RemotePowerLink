import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { observer } from 'mobx-react-lite';

interface SftpMenuProps {
    className?: string;
}



function SftpMenu ({ className }: SftpMenuProps) {
    
    
    return (
        <div className={classNames(style.sftpMenuOptions, {}, [className])}>

        </div>
    );
}

export default observer(SftpMenu);
