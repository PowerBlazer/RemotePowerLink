import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarItem.module.scss';
import { Button } from 'shared/ui/Button/Button';
import {useNavigate} from "react-router-dom";

interface NavbarItemProps {
    className?: string;
    icon: any,
    label: string,
    isSelected?: boolean
    navigate?: string
}

export function NavbarItem ({
    className, 
    icon, 
    label, 
    isSelected = false,
    navigate
}: NavbarItemProps) {
    const location1 = useNavigate();
    
    return (
        <Button 
            className={classNames(style.navbarItem, {
                [style.selected]: isSelected
            }, [className])}
            onClick={()=>{
                if(navigate){
                    location1(navigate);
                }
            }}
        >
            <div className={classNames(style.icon_block)}>{icon}</div>
            {label}
        </Button>
    );
}
