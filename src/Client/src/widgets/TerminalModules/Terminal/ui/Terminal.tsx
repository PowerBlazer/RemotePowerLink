import { classNames } from 'shared/lib/classNames/classNames';
import './Terminal.css'
import { Terminal as XtermTerminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useEffect, useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import terminalStore, { TerminalScreenSplitMode } from 'app/store/terminalStore';
import { ConnectionState } from 'app/hubs/hubFactory';
import { TerminalScreenMode } from 'widgets/TerminalModules/TerminalCatalog/ui/TerminalCatalog';
import useTerminal from 'app/hooks/useTerminal';
import { useEffectAsync } from 'app/hooks/useEffectAsync';

interface TerminalProps extends TerminalScreenMode {
    className?: string;
}

function Terminal ({ className, index }: TerminalProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XtermTerminal | null>(null);

    const terminalTheme = useMemo(() =>
        terminalStore
            .terminalThemes
            .find(p => p.id === terminalStore.terminalSetting.terminalThemeId),

    [terminalStore.terminalSetting?.terminalThemeId, terminalStore.terminalThemes]
    );

    const { getGroupTerminalSessions } = useTerminal();
    const groupTerminalSessions = getGroupTerminalSessions(index);

    useEffectAsync(async () => {
        if (terminalRef.current) {
            const xterm = new XtermTerminal();
            const fitAddon = new FitAddon();

            xterm.options.cursorBlink = true;
            xterm.options.fontSize = terminalStore.terminalSetting?.fontSize;
            xterm.options.theme = {
                background: terminalTheme.background,
                foreground: terminalTheme.foreground,
                cursor: terminalTheme.cursor,
                selectionBackground: terminalTheme.selection,
                black: terminalTheme.black,
                red: terminalTheme.red,
                green: terminalTheme.green,
                yellow: terminalTheme.yellow,
                blue: terminalTheme.blue,
                magenta: terminalTheme.purple,
                cyan: terminalTheme.cyan,
                white: terminalTheme.white,
                brightBlack: terminalTheme.brightBlack,
                brightRed: terminalTheme.brightRed,
                brightGreen: terminalTheme.brightGreen,
                brightYellow: terminalTheme.brightYellow,
                brightBlue: terminalTheme.brightBlue,
                brightMagenta: terminalTheme.brightPurple,
                brightCyan: terminalTheme.brightCyan,
                brightWhite: terminalTheme.brightWhite
            };

            xterm.loadAddon(fitAddon);
            xterm.open(terminalRef.current);
            fitAddon.fit();

            xtermRef.current = xterm;

            if (groupTerminalSessions.selectedSession && !groupTerminalSessions.selectedSession.isNew) {
                xterm.onData(data => {
                    if (terminalStore.terminalHub?.getConnectionState() === ConnectionState.Connected && groupTerminalSessions.selectedSession) {
                        terminalStore.terminalHub.writeToSession(groupTerminalSessions.selectedSession.id, data);
                    }
                });

                groupTerminalSessions.selectedSession.onOutput = (data) => {
                    xterm.write(data);
                }

                groupTerminalSessions.selectedSession.isLoad = true;

                await terminalStore.terminalHub.activateSession(groupTerminalSessions.selectedSession.id)
            }

            return () => {
                xterm.dispose();
            };
        }
    }, [groupTerminalSessions.selectedSession, terminalStore.terminalSetting]);

    return <div
        ref={terminalRef}
        className={classNames('xterm_terminal', {}, [className])}
        style={{ width: '100%', height: '100%', fontSize: 22 }}
    />;
}

export default observer(Terminal);
