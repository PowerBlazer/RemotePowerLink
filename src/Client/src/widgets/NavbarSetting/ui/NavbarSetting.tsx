import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarSetting.module.scss';
import { Button } from 'shared/ui/Button/Button';
import GearIcon from 'shared/assets/icons/navbar/gear.svg';
import NotificationIcon from 'shared/assets/icons/navbar/bell-alt.svg';
import { ButtonExit } from 'features/ButtonExit';

interface NavbarSettingProps {
    className?: string;
}

export function NavbarSetting ({ className }: NavbarSettingProps) {
    return (
        <div className={classNames(style.navbarSetting, {}, [className])}>
            <Button className={classNames(style.setting_button)}>
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
