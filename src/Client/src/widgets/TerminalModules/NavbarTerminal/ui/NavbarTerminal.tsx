import { classNames } from 'shared/lib/classNames/classNames';
import style from './NavbarTerminal.module.scss';
import { observer } from 'mobx-react-lite';
import { Button } from 'shared/ui/Button/Button';
import PlusIcon from 'shared/assets/icons/plus.svg';
import terminalStore, { TerminalSession } from 'app/store/terminalStore';
import TerminalIcon from 'shared/assets/icons/terminal-cursor.svg'
import CloseIcon from 'shared/assets/icons/close.svg';
import { MouseEvent, useEffect, useMemo, useRef } from 'react';
import { ConnectionState } from 'app/hubs/hubFactory';
import { Loader } from 'shared/ui/Loader/Loader';
import useTerminal from 'app/hooks/useTerminal';

interface NavbarTerminalProps {
    className?: string;
    onClickSelectHost: () => void
}

function NavbarTerminal ({ className, onClickSelectHost }: NavbarTerminalProps) {
    const { closeSession, selectSession } = useTerminal();
    const sessionTabsRef = useRef<HTMLDivElement>(null);

    const terminalTheme = useMemo(() => terminalStore
        .terminalThemes
        .find(p => p.id === terminalStore.terminalSetting.terminalThemeId),
    [terminalStore.terminalSetting.terminalThemeId, terminalStore.terminalThemes]
    );

    const isLight = isLightBackground(terminalTheme.background);

    const closeSessionHandler = async (e: MouseEvent<HTMLDivElement>, sessionId: number) => {
        e.stopPropagation();

        await closeSession(sessionId);
    }

    const selectTab = async (session: TerminalSession) => {
        await selectSession(session);
    }

    useEffect(() => {
        const tabsContainer = sessionTabsRef.current;

        const handleWheel = (e: any) => {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
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
        <div className={classNames(style.navbarTerminal, {}, [className])} style={{ backgroundColor: terminalTheme.background }}>
            <div className={classNames(style.session_tabs)} ref={sessionTabsRef} >
                {
                    terminalStore.sessions.map(session =>
                        <Button
                            className={classNames(style.session_tab, {
                                [style.selected]: terminalStore.selectedSession && terminalStore.selectedSession.id === session.id,
                                [style.isLight]: isLight
                            }, [])}
                            key={session.id}
                            onClick={async () => { await selectTab(session); }}
                            type='button'
                        >
                            <div className={classNames(style.session_tab_inner)}>
                                {
                                    session.isLoad
                                        ? <Loader className={classNames(style.loader)}/>
                                        : <TerminalIcon width={16} height={16} className={classNames(style.terminal_icon)}/>

                                }
                                <div className={classNames(style.session_title)}>
                                    {session.name ?? session.host?.title}
                                </div>
                            </div>

                            <div
                                className={classNames(style.close_session)}
                                onClick={async (e) => { await closeSessionHandler(e, session.id); }}
                            >
                                <CloseIcon width={13} height={13}/>
                            </div>
                        </Button>
                    )
                }
                <div className={classNames(style.open_session_block, { [style.isLight]: isLight })}>
                    <div className={classNames(style.line)}></div>
                    <Button className={classNames(style.open_session)} onClick={onClickSelectHost}>
                        <PlusIcon width={14} height={14} className={classNames(style.plus_icon)}/>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default observer(NavbarTerminal);
