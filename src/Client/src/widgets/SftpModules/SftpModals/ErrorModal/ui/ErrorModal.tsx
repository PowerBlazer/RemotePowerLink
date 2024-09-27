import { classNames } from 'shared/lib/classNames/classNames';
import style from './ErrorModal.module.scss';
import { observer } from 'mobx-react-lite';
import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import sftpStore from 'app/store/sftpStore';
import { SftpCatalogModeProps } from 'widgets/SftpModules/SftpCatalog';
import { useTheme } from 'shared/lib/Theme/useTheme';

interface ErrorModalProps extends SftpCatalogModeProps {
    className?: string;
}

function ErrorModal ({ className, mode }: ErrorModalProps) {
    const selectedHost = sftpStore.getSelectedHostInMode(mode);
    const { theme } = useTheme();

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
                {selectedHost?.error?.errors && Object.entries(selectedHost.error?.errors).map(([key, value]) => {
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
