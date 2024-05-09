import { observer } from 'mobx-react-lite';
import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import { SftpCatalogModeProps } from 'widgets/SftpCatalog';
import sftpStore from 'app/store/sftpStore';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { useEffect, useState } from 'react';
import { SftpFile } from 'app/services/SftpService/config';

interface SendModalProps extends SftpCatalogModeProps {
    className?: string;
}

function SendModal ({ className, mode }: SendModalProps) {
    const selectedHost = sftpStore.getSelectedHostInMode(mode);
    const { t } = useTranslation('translation');
    const { theme } = useTheme();

    const [selectedSendFiles, setSelectedFiles] = useState<SftpFile[]>([]);

    const sendFilesHandler = () => {

    }

    useEffect(() => {
        if (selectedHost?.sftpFilesOption.fileList) {
            const selectedFilesItems = selectedHost.sftpFilesOption.fileList
                .filter(p => p.isSelected);

            setSelectedFiles(selectedFilesItems);
        }
    }, [selectedHost?.sftpFilesOption.fileList]);

    return (
        <Modal
            options={{
                type: TypeModal.FORM,
                onCancel: () => { selectedHost.modalOption.sendState = false; },
                onConfirm: async () => {},
                headerName: t('Отправить файлы на другой сервер')
            }}
            className={ className }
            theme={ theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK }
            isVisible={ selectedHost?.modalOption?.sendState }
        >

        </Modal>
    );
}

export default observer(SendModal)
