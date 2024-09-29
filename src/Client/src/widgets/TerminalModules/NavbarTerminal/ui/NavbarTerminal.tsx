import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarTerminal.module.scss';
import {observer} from "mobx-react-lite";
import {Button} from "shared/ui/Button/Button";
import PlusIcon from 'shared/assets/icons/plus.svg';
import terminalStore from "app/store/terminalStore";
import TerminalIcon from 'shared/assets/icons/terminal-cursor.svg'
import CloseIcon from 'shared/assets/icons/close.svg';
import {MouseEvent, useEffect, useRef} from "react";

interface NavbarTerminalProps {
    className?: string;
    onClickSelectHost: () => void
}

function NavbarTerminal ({ className, onClickSelectHost }: NavbarTerminalProps) {
    const sessionTabsRef = useRef<HTMLDivElement>(null);
    
    const closeSession = async (e: MouseEvent<HTMLDivElement> ,sessionId: number) => {
        e.stopPropagation();
        
        terminalStore.sessions = terminalStore.sessions.filter(p=> p.id !== sessionId);
        
        if(terminalStore.selectedSession?.id === sessionId && terminalStore.sessions.length > 0){
            terminalStore.selectedSession = terminalStore.sessions[0];
        }
    }

    useEffect(() => {
        const tabsContainer = sessionTabsRef.current;

        const handleWheel = (e:any) => {
            tabsContainer.scrollLeft += e.deltaY;
        };

        if (tabsContainer) {
            tabsContainer.addEventListener('wheel', handleWheel);
        }
        
        return () => {
            if (tabsContainer) {
                tabsContainer.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);
    
    return (
        <div className={classNames(style.navbarTerminal, {}, [className])}>
            <div className={classNames(style.session_tabs)} ref={sessionTabsRef}>
                {
                    terminalStore.sessions.map(session => 
                        <Button 
                            className={classNames(style.session_tab,{
                                [style.selected]: terminalStore.selectedSession && 
                                    terminalStore.selectedSession.id === session.id
                            }, [])} 
                            key={session.id}
                            onClick={() => terminalStore.selectedSession = session}
                            type='button'
                        >
                            <div className={classNames(style.session_tab_inner)}>
                                <TerminalIcon width={16} height={16} className={classNames(style.terminal_icon)}/>
                                <div className={classNames(style.session_title)}>{session.host?.title}</div>
                            </div>
                            
                            <div 
                                className={classNames(style.close_session)}
                                onClick={(e) => closeSession(e, session.id)}
                            >
                                <CloseIcon width={13} height={13}/>
                            </div>
                        </Button>
                    )
                }
                <div className={classNames(style.open_session_block)}>
                    <div className={classNames(style.line)}></div>
                    <Button className={classNames(style.open_session)} onClick={onClickSelectHost}>
                        <PlusIcon width={14} height={14} className={classNames(style.plus_icon)}/>
                    </Button>
                </div>
            </div>
		</div>
    );
}

export default observer(NavbarTerminal)