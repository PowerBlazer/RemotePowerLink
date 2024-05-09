import { observer } from 'mobx-react-lite';
import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import sftpStore from 'app/store/sftpStore';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { useTranslation } from 'react-i18next';
import { SftpCatalogModeProps } from 'widgets/SftpCatalog';
import { ChangeEvent, useMemo, useState } from 'react';
import { FileType } from 'app/services/SftpService/config';
import { Input } from 'shared/ui/Input';
import { SftpService } from 'app/services/SftpService/sftpService';

interface RenameModalProps extends SftpCatalogModeProps {
    className?: string;
}

function RenameModal ({ className, mode }: RenameModalProps) {
    const selectedHost = sftpStore.getSelectedHostInMode(mode);
    const { theme } = useTheme();
    const { t } = useTranslation('translation');

    const [newName, setName] = useState<string>('');
    const [errors, setErrors] = useState<string[]>(
        ['Название файла или папки не может быть пустым']
    );

    const selectedFileItem = useMemo(() => selectedHost?.sftpFileList?.fileList
        .find(p => p.isSelected), [selectedHost?.sftpFileList?.fileList]);

    const selectedTypeName = selectedFileItem
        ? (selectedFileItem?.fileType === FileType.Folder
            ? t('папки')
            : t('файл'))
        : null

    const renameFileOrFolderHandler = async () => {
        const renameFileOrFolderResult = await SftpService.renameFileOrFolder({
            fileItemPath: selectedFileItem?.path,
            fileItemNewName: newName,
            serverId: selectedHost?.server.serverId
        });

        if (renameFileOrFolderResult.isSuccess) {
            selectedHost.isLoad = true;

            await selectedHost.sftpHub.getFilesServer(
                selectedHost?.server.serverId,
                selectedHost?.sftpFileList?.currentPath
            );
        }

        if (!renameFileOrFolderResult.isSuccess) {
            selectedHost.error = { errors: renameFileOrFolderResult.errors }
            selectedHost.modalOption.errorState = true;
        }

        selectedHost.modalOption.renameState = false;
    }

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors([]);
        setName(e.currentTarget.value);

        if (e.target?.value?.length === 0) {
            setErrors([
                t(`Название ${selectedTypeName} не может быть пустым`)
            ]);

            return;
        }

        if (!selectedFileItem) {
            setErrors([
                t('Папка или файл не выбрана')
            ]);

            return;
        }

        const fileListWithType = selectedHost?.sftpFileList?.fileList
            .filter(p => p.fileType === selectedFileItem.fileType && p.name === e.target.value);

        if (fileListWithType.length > 0 || e.target.value === '.' || e.target.value === '..') {
            setErrors([
                t(`${selectedTypeName?.charAt(0).toUpperCase() + selectedTypeName.slice(1)} с таким названием уже существует`)
            ]);
        }
    }

    return (
        <Modal
            options={{
                type: TypeModal.FORM,
                onCancel: () => { selectedHost.modalOption.renameState = false; },
                onConfirm: renameFileOrFolderHandler,
                disabled: errors.length > 0,
                headerName: `${t('Переименовать')} ${selectedFileItem && (selectedFileItem?.fileType === FileType.Folder
                    ? t('папку')
                    : t('файл'))}`

            }}
            className={className}
            theme={ theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK }
            isVisible={ selectedHost?.modalOption?.renameState }
        >
            <Input
                type={'text'}
                placeholder={`${t('Название')} ${selectedTypeName}`}
                value={newName}
                errors={errors}
                onChange={onChangeInputHandler}
            />
        </Modal>
    );
}

export default observer(RenameModal)
