import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarItem.module.scss';
import { Button } from 'shared/ui/Button/Button';
import { useNavigate } from 'react-router-dom';

interface NavbarItemProps {
    className?: string;
    icon: any,
    label: string,
    isSelected?: boolean
    navigate?: string,
    onNavigate?: () => void
}

export function NavbarItem (props: NavbarItemProps) {
    const {
        className,
        icon,
        label,
        isSelected = false,
        navigate,
        onNavigate
    } = props;
    
    const location = useNavigate();
    
    const onClickNavigateHandler = () => {
        if (navigate) {
            location(navigate);
        }
        
        if(navigate){
            onNavigate();
        }
    }

    return (
        <Button
            className={classNames(style.navbarItem, { [style.selected]: isSelected }, [className])}
            onClick={onClickNavigateHandler}
        >
            <div className={classNames(style.icon_block)}>{icon}</div>
            {label}
        </Button>
    );
}
