import { classNames } from 'shared/lib/classNames/classNames';
import style from './ButtonExit.module.scss';
import {Button} from "shared/ui/Button/Button";
import ExitIcon from 'shared/assets/icons/navbar/exit.svg';
import {AuthorizationService} from "app/services/AuthorizationService/authorizationService";
import {useNavigate} from "react-router-dom";
import {RoutePath} from "app/providers/router/config/routeConfig";

interface ButtonExitProps {
    className?: string;
}

export function ButtonExit ({ className }: ButtonExitProps) {
    const navigate = useNavigate()
    
    const exitClickHandler = () => {
        AuthorizationService.logout();
        
        navigate(RoutePath.login.toString())
    }
    
    
    return (
        <Button 
            className={classNames(style.buttonExit, {}, [className])}
            onClick={exitClickHandler}
        >
            <ExitIcon width={22} height={22}/>
		</Button>
    );
}