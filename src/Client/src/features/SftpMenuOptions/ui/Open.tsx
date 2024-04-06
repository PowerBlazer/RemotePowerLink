import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import {MenuOptionProp} from "features/SftpMenuOptions";
import {Button} from "shared/ui/Button/Button";

interface OpenProps extends MenuOptionProp{
    className?: string;
}

export function Open ({ className, disabled, mode, onClick }: OpenProps) {
    const onClickOpenHandler = () => {
        if(disabled)
            return;
        
        if(onClick){
            onClick()
        }
    }
    
    return (
        <Button 
            className={classNames(style.open, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickOpenHandler}
        >
            Open
		</Button>
    );
}