import { classNames } from 'shared/lib/classNames/classNames';
import style from './ErrorModal.module.scss';
import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import terminalStore from 'app/store/terminalStore';
import { observer } from 'mobx-react-lite';
import { TerminalScreenMode } from 'widgets/TerminalModules/TerminalCatalog/ui/TerminalCatalog';
import useTerminal from 'app/hooks/useTerminal';

interface ErrorModalProps extends TerminalScreenMode {
    className?: string;
}

function ErrorModal ({ className, index }: ErrorModalProps) {
    const { theme } = useTheme();

    const { getGroupTerminalSessions } = useTerminal();
    const groupTerminalSessions = getGroupTerminalSessions(index);

    return (
        <Modal
            options={{
                type: TypeModal.ERROR,
                onCancel: () => {
                    terminalStore.modalOptions.errorState = false;
                }
            }}
            className={className}
            theme={theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK}
            isVisible={Boolean(terminalStore.modalOptions.errorState)}
        >
            <div className={classNames(style.error_panel)}>
                {groupTerminalSessions.selectedSession?.errors && Object.entries(groupTerminalSessions.selectedSession?.errors)
                    .map(([key, value]) => {
                        return (
                            <div className={classNames(style.error)} key={key}>
                                {key}:  {value?.join(' ')}
                            </div>
                        );
                    })}
            </div>
        </Modal>
    );
}

export default observer(ErrorModal);
