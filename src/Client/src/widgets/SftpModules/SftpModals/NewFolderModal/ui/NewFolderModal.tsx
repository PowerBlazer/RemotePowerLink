import { observer } from 'mobx-react-lite';
import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import { Input } from 'shared/ui/Input';
import { SftpCatalogModeProps } from 'widgets/SftpModules/SftpCatalog';
import sftpStore from 'app/store/sftpStore';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileType } from 'app/services/SftpService/config';
import { SftpService } from 'app/services/SftpService/sftpService';

interface NewFolderModalProps extends SftpCatalogModeProps {
    className?: string;
}

function NewFolderModal ({ className, mode }: NewFolderModalProps) {
    const selectedHost = sftpStore.getSelectedHostInMode(mode);
    const { theme } = useTheme();
    const { t } = useTranslation('translation')

    const [newFolderName, setFolderName] = useState<string>('');
    const [errors, setErrors] = useState<string[]>(
        ['Название папки не может быть пустым']
    );

    const createNewFolderHandler = async () => {
        const createDirectoryResult = await SftpService.createDirectory({
            directoryPath: selectedHost?.sftpFileList?.currentPath,
            directoryName: newFolderName,
            serverId: selectedHost?.server.serverId
        });

        if (createDirectoryResult.isSuccess) {
            selectedHost.isLoad = true;

            await selectedHost.sftpHub.getFilesServer(
                selectedHost?.server.serverId,
                selectedHost?.sftpFileList?.currentPath
            );
        }

        if (!createDirectoryResult.isSuccess) {
            selectedHost.error = { errors: createDirectoryResult.errors }
            selectedHost.modalOption.errorState = true;
        }

        selectedHost.modalOption.newFolderState = false
    }

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors([]);
        setFolderName(e.currentTarget.value);

        if (e.target?.value?.length === 0) {
            setErrors([
                t('Название папки не может быть пустым')
            ]);

            return;
        }

        const fileListWithFolders = selectedHost?.sftpFileList?.fileList
            .filter(p => p.fileType === FileType.Folder && p.name === e.target.value);

        if (fileListWithFolders.length > 0 || e.target.value === '.' || e.target.value === '..') {
            setErrors([
                t('Папка с таким название уже существует')
            ]);
        }
    }

    return (
        <Modal
            options={{
                type: TypeModal.FORM,
                headerName: t('Новая папка'),
                onCancel: () => { selectedHost.modalOption.newFolderState = false },
                onConfirm: createNewFolderHandler,
                disabled: errors.length > 0
            }}
            theme={ theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK }
            isVisible={ selectedHost?.modalOption.newFolderState }
        >
            <Input
                type={'text'}
                placeholder={t('Название новой папки')}
                value={newFolderName}
                errors={errors}
                onChange={onChangeInputHandler}
            />
        </Modal>
    );
}

export default observer(NewFolderModal)
