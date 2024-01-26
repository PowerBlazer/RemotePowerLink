import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarHosts.module.scss';

interface NavbarHostsProps {
    className?: string;
}

export function NavbarHosts ({ className }: NavbarHostsProps) {
    return (
        <div className={classNames(style.NavbarHosts, {}, [className])}>

        </div>
    );
}
