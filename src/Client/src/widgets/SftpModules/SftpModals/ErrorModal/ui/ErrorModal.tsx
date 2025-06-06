import { classNames } from 'shared/lib/classNames/classNames';
import style from './ErrorModal.module.scss';
import { observer } from 'mobx-react-lite';
import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import { SftpWindowsOptionProps } from 'widgets/SftpModules/SftpCatalog';
import { useTheme } from 'shared/lib/Theme/useTheme';
import useSftp from 'app/hooks/useSftp';

interface ErrorModalProps extends SftpWindowsOptionProps {
    className?: string;
}

function ErrorModal ({ className, windowsIndex }: ErrorModalProps) {
    const { theme } = useTheme();
    const { getHost } = useSftp(windowsIndex);

    const selectedHost = getHost();

    return (
        <Modal
            options={{
                type: TypeModal.ERROR,
                onCancel: () => { selectedHost.modalOption.errorState = false; }
            }}
            className={className}
            theme={ theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK }
            isVisible={Boolean(selectedHost?.modalOption?.errorState)}
        >
            <div className={classNames(style.error_panel)}>
                {selectedHost?.errors && Object.entries(selectedHost.errors).map(([key, value]) => {
                    return (
                        <div className={classNames(style.error)} key={key}>
                            {key}:  {value?.join(' ')}
                        </div>
                    )
                })}
            </div>
        </Modal>
    );
}

export default observer(ErrorModal);
