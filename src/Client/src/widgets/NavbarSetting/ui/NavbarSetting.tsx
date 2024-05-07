import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarSetting.module.scss';
import { Button } from 'shared/ui/Button/Button';
import GearIcon from 'shared/assets/icons/navbar/gear.svg';
import NotificationIcon from 'shared/assets/icons/navbar/bell-alt.svg';
import { ButtonExit } from 'features/ButtonExit';
import {useNavigate} from "react-router-dom";
import userStore from "app/store/userStore";
import {AppRoutes} from "app/providers/router/config/routeConfig";

interface NavbarSettingProps {
    className?: string;
}

export function NavbarSetting ({ className }: NavbarSettingProps) {
    const navigate = useNavigate();
    const navigateSettingPage = () => {
        userStore.location = AppRoutes.SETTINGS;
        
        navigate(`/${AppRoutes.SETTINGS}`)
    }
    
    
    return (
        <div className={classNames(style.navbarSetting, {}, [className])}>
            <Button className={classNames(style.setting_button)} onClick={navigateSettingPage}>
                <GearIcon width='20px' height='20px' />
            </Button>

            <div className={classNames(style.common_buttons)}>
                <Button className={classNames(style.notification)}>
                    <NotificationIcon width='20px' height='20px'/>
                </Button>
                <ButtonExit/>
            </div>
        </div>
    );
}
