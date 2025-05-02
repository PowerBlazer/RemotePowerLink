import { classNames } from 'shared/lib/classNames/classNames';
import style from './TerminalCatalog.module.scss';
import { observer } from 'mobx-react-lite';
import { NavbarTerminal } from 'widgets/TerminalModules/NavbarTerminal';
import terminalStore from 'app/store/terminalStore';
import { Loader } from 'shared/ui/Loader/Loader';
import { Terminal } from 'widgets/TerminalModules/Terminal';
import { useMemo, useState } from 'react';
import { SelectHostBlock } from 'features/SelectHostBlock';
import { TerminalSelectHostCatalog } from 'widgets/TerminalModules/TerminalSelectHostCatalog';
import { ErrorModal } from 'widgets/TerminalModules/TerminalModals/ErrorModal';
import useTerminal from 'app/hooks/useTerminal';

export interface TerminalScreenMode {
    index: number;
}

interface TerminalCatalogProps extends TerminalScreenMode {
    className?: string;
}

function TerminalCatalog ({ className, index }: TerminalCatalogProps) {
    const [isSelectHost, setIsSelectHost] = useState<boolean>(false);

    const { getGroupTerminalSessions } = useTerminal();
    const groupTerminalSessions = getGroupTerminalSessions(index);

    const isSessionsNull = groupTerminalSessions.sessions.length === 0;

    const terminalTheme = useMemo(
        () => terminalStore
            .terminalThemes
            .find(p => p.id === terminalStore.terminalSetting?.terminalThemeId),

        [terminalStore.terminalSetting?.terminalThemeId, terminalStore.terminalThemes]
    );

    if (isSessionsNull && !isSelectHost) {
        return (
            <div className={classNames(style.terminalCatalog, {}, [style.information])}>
                <SelectHostBlock onClick={() => { setIsSelectHost(true); }}/>
            </div>
        )
    }

    if (isSelectHost) {
        return (
            <div className={classNames(style.terminalCatalog, {}, [style.information])}>
                <TerminalSelectHostCatalog index={index} onClose={() => { setIsSelectHost(false); }} />
            </div>
        )
    }

    return (
        <div className={classNames(style.terminalCatalog, {}, [className])} style={{ backgroundColor: terminalTheme?.background }}>
            <div className={classNames(style.header)}>
                <NavbarTerminal index={index} onClickSelectHost={() => { setIsSelectHost(true); }}/>
            </div>
            <div className={classNames(style.main)}>
                {groupTerminalSessions.selectedSession?.isLoad && <Loader className={classNames(style.terminal_loader)}/>}
                {groupTerminalSessions.selectedSession && <Terminal index={index}/>}
            </div>

            {terminalStore.modalOptions.errorState && <ErrorModal index={index}/>}
        </div>
    );
}

export default observer(TerminalCatalog)
