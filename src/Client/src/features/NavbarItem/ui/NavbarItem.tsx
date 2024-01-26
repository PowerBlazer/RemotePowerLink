import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarItem.module.scss';
import { Button } from 'shared/ui/Button/Button';

interface NavbarItemProps {
    className?: string;
    icon: any,
    label: string
}

export function NavbarItem ({ className, icon, label }: NavbarItemProps) {
    return (
        <Button className={classNames(style.navbarItem, {}, [className])}>
            <div className={classNames(style.icon_block)}>{icon}</div>
            {label}
        </Button>
    );
}
