import { classNames } from 'shared/lib/classNames/classNames';
import './Terminal.css'
import { Terminal as XtermTerminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import terminalStore from 'app/store/terminalStore';
import { ConnectionState } from 'app/hubs/hubFactory';

interface TerminalProps {
    className?: string;
}

function Terminal ({ className }: TerminalProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XtermTerminal | null>(null);

    useEffect(() => {
        if (terminalRef.current) {
            const xterm = new XtermTerminal();
            const fitAddon = new FitAddon();

            xterm.options.cursorBlink = true;

            xterm.loadAddon(fitAddon);
            xterm.open(terminalRef.current);
            fitAddon.fit();

            xtermRef.current = xterm;

            if (terminalStore.selectedSession && !terminalStore.selectedSession.isNew) {
                xterm.onData(data => {
                    if (terminalStore.terminalHub?.getConnectionState() === ConnectionState.Connected && terminalStore.selectedSession) {
                        terminalStore.terminalHub.writeToSession(terminalStore.selectedSession.id, data);
                    }
                });

                terminalStore.selectedSession.isLoad = true;

                if (!terminalStore.selectedSession.isCreate) {
                    terminalStore.terminalHub.activateSession(terminalStore.selectedSession.id)
                } else {
                    terminalStore.selectedSession.isCreate = false;
                }

                terminalStore.selectedSession.onOutput = (data) => {
                    xterm.write(data);
                }
            }

            // Обработка очистки при размонтировании компонента
            return () => {
                xterm.dispose();
            };
        }
    }, [terminalStore.selectedSession]);

    return <div
        ref={terminalRef}
        className={classNames('xterm_terminal', {}, [className])}
        style={{ width: '100%', height: '100%' }}
    />;
}

export default observer(Terminal);
