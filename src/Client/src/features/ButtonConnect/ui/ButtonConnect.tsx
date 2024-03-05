import { classNames } from 'shared/lib/classNames/classNames';
import style from './ButtonConnect.module.scss';
import {Button} from "shared/ui/Button/Button";
import PlugIcon from 'shared/assets/icons/plug.svg';
import {ServerManagerData} from "features/ServerManagerGroup";

interface ButtonConnectProps {
    className?: string;
    serverData: ServerManagerData
}

export function ButtonConnect ({ className,serverData }: ButtonConnectProps) {
    const connectServerClickHandler = async () => {
        
    }
    
    return (
        <Button 
            className={classNames(style.buttonConnect, {}, [className])}
        >
            <PlugIcon width={20} height={22}/>
		</Button>
    );
}