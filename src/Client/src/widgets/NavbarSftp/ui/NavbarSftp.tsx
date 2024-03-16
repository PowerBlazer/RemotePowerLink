import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarSftp.module.scss';
import {observer} from "mobx-react-lite";

interface NavbarSftpProps {
    className?: string;
}

function NavbarSftp ({ className }: NavbarSftpProps) {
    return (
        <div className={classNames(style.navbarSftp, {}, [className])}>
            
		</div>
    );
}

export default observer(NavbarSftp)