import { classNames } from 'shared/lib/classNames/classNames';
import style from './ErrorModal.module.scss';
import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import terminalStore from 'app/store/terminalStore';
import { observer } from 'mobx-react-lite';

interface ErrorModalProps {
    className?: string;
}

function ErrorModal ({ className }: ErrorModalProps) {
    const { theme } = useTheme();

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
                {terminalStore.selectedSession?.errors && Object.entries(terminalStore.selectedSession?.errors)
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
