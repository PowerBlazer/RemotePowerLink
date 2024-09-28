import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarTerminal.module.scss';
import {observer} from "mobx-react-lite";
import {Button} from "shared/ui/Button/Button";
import PlusIcon from 'shared/assets/icons/plus.svg';

interface NavbarTerminalProps {
    className?: string;
}

function NavbarTerminal ({ className }: NavbarTerminalProps) {
    
    return (
        <div className={classNames(style.navbarTerminal, {}, [className])}>
            <div className={classNames(style.session_tabs)}>
                <Button className={classNames(style.open_session)}>
                    <PlusIcon width={14} height={14} className={classNames(style.plus_icon)}/>
                </Button>
            </div>
		</div>
    );
}

export default observer(NavbarTerminal)