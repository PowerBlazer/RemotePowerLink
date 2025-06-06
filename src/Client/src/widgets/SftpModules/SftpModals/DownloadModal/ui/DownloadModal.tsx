import { classNames } from 'shared/lib/classNames/classNames';
import style from './DownloadModal.module.scss';
import { observer } from 'mobx-react-lite';
import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import { SftpWindowsOptionProps } from 'widgets/SftpModules/SftpCatalog';
import React, { useEffect, useMemo, useState } from 'react';
import sftpStore from 'app/store/sftpStore';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { useTranslation } from 'react-i18next';
import { SftpService } from 'app/services/SftpService/sftpService';
import { Loader } from 'shared/ui/Loader/Loader';
import { HostService } from 'app/services/hostService';
import useSftp from 'app/hooks/useSftp';

interface DownloadModalProps extends SftpWindowsOptionProps {
    className?: string;
}

function DownloadModal ({ className, windowsIndex }: DownloadModalProps) {
    const { t } = useTranslation('translation');
    const { theme } = useTheme();
    const { getHost } = useSftp(windowsIndex);

    const selectedHost = getHost();

    const [errors, setErrors] = useState<string[]>([]);
    const [isLoad, setLoad] = useState<boolean>(false);
    const [sizeSelectedFileItems, setSize] = useState<number>();

    const selectedFileItems = useMemo(() => selectedHost?.sftpFileList?.fileList
        .filter(p => p.isSelected), [selectedHost?.sftpFileList?.fileList]);

    const downloadHandler = async () => {
        const cancelToken = HostService.getCancelToken();

        selectedHost.modalOption.downloadState = false;

        selectedHost.notificationOptions = {
            data: {
                operationName: 'Отправка запроса на скачивание файлов',
                isProgress: false
            },
            onCancel: () => {
                cancelToken.cancel('Request canceled by the user')
            }
        }

        let prevProgressState = 0;
        const downloadResult = await SftpService.downloadFoldersOrFiles({
            filesOrFoldersToDownloadList: selectedFileItems,
            serverId: selectedHost?.server.serverId,
            connectionId: selectedHost.sftpHub.getConnectionId()
        }, cancelToken, (progress) => {
            if (prevProgressState !== progress) {
                prevProgressState = progress;

                selectedHost.notificationOptions = {
                    ...selectedHost.notificationOptions,
                    data: {
                        operationName: 'Скачивание',
                        isProgress: true,
                        progressPercent: progress
                    }
                }
            }
        });

        if (!downloadResult.isSuccess && Boolean(downloadResult.errors)) {
            selectedHost.errors = downloadResult.errors
            selectedHost.modalOption.errorState = true;
        }

        selectedHost.notificationOptions = null;
    }

    useEffect(() => {
        setErrors([]);

        async function getSizeEvent () {
            if (selectedHost?.modalOption.downloadState) {
                setLoad(true);
                const getSizeResult = await SftpService.getSizeFoldersOrFiles({
                    serverId: selectedHost?.server.serverId,
                    foldersOrFiles: selectedFileItems
                });

                setSize(getSizeResult.result);
                setLoad(false);

                if (getSizeResult.isSuccess && getSizeResult.result >= HostService.MaximumDownloadSizeBytes) {
                    setErrors(['Превышен лимит выбранных файлов 5GB размера скачивания'])
                }

                if (!getSizeResult.isSuccess) {
                    selectedHost.errors = getSizeResult.errors
                    selectedHost.modalOption.downloadState = false;
                    selectedHost.modalOption.errorState = true;
                }
            }
        }

        getSizeEvent();
    }, [selectedHost?.modalOption.downloadState]);

    return (
        <Modal
            options={{
                type: TypeModal.FORM,
                onCancel: () => { selectedHost.modalOption.downloadState = false; },
                onConfirm: downloadHandler,
                disabled: errors.length > 0 || isLoad,
                headerName: isLoad ? t('Оценка файлов для загрузки') : t('Скачать')
            }}
            className={className}
            theme={ theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK }
            isVisible={ selectedHost?.modalOption?.downloadState }
        >
            <div className={classNames(style.files_download)}>
                { isLoad && <Loader className={style.loader}/> }
                { !isLoad && sizeSelectedFileItems &&
                    <div className={classNames(style.size_selected_files)}>
                        {`${t('Размер выделенных папок и файлов: ')} ${formatFileSize(sizeSelectedFileItems)}`}
                    </div>
                }
                { errors.length > 0 &&
                    <div className={classNames(style.errors)}>
                        {errors.map(error => (
                            <p className={classNames(style.error)} key={error}>{error}</p>
                        ))}
                    </div>
                }
                { !isLoad &&
                    <div className={classNames(style.list_files)}>
                        <div className={classNames(style.header_list)}>{t('Выбраны файлы на скачивание: ')}</div>
                        {selectedFileItems?.map(fileItem => (
                            <div className={classNames(style.file_name)} key={fileItem.path}>- {fileItem.name}</div>
                        ))}
                    </div>
                }
            </div>
        </Modal>
    );
}

function formatFileSize (fileSize: number): string {
    const byteConversion = 1024;
    const bytes = fileSize;

    if (bytes >= Math.pow(byteConversion, 3)) { // Гигабайты
        return `${(bytes / Math.pow(byteConversion, 3)).toFixed(2)} GB`;
    } else if (bytes >= Math.pow(byteConversion, 2)) { // Мегабайты
        return `${(bytes / Math.pow(byteConversion, 2)).toFixed(2)} MB`;
    } else if (bytes >= byteConversion) { // Килобайты
        return `${(bytes / byteConversion).toFixed(2)} KB`;
    } else { // Байты
        return `${bytes} bytes`;
    }
}

export default observer(DownloadModal)
