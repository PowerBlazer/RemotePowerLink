import { observer } from 'mobx-react-lite';
import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import { SftpCatalogModeProps } from 'widgets/SftpModules/SftpCatalog';
import sftpStore from 'app/store/sftpStore';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { ChangeEvent, useEffect, useState } from 'react';
import { FileType, SftpFile } from 'app/services/SftpService/config';
import { classNames } from 'shared/lib/classNames/classNames';
import style from './SendModal.module.scss';
import FileIcon from 'shared/assets/icons/sftp/file.svg';
import FolderIcon from 'shared/assets/icons/sftp/folder.svg';
import { Button } from 'shared/ui/Button/Button';
import { ServerData } from 'app/services/ServerService/config/serverConfig';
import { Select, SelectedItem, SelectItem } from 'shared/ui/Select';
import userStore from 'app/store/userStore';
import { HostService } from 'app/services/hostService';
import { DefaultServerIcon } from 'shared/ui/DefaultServerIcon';
import { Input } from 'shared/ui/Input';
import { Loader } from 'shared/ui/Loader/Loader';
import { SftpService } from 'app/services/SftpService/sftpService';

interface SendModalProps extends SftpCatalogModeProps {
    className?: string;
}

function SendModal ({ className, mode }: SendModalProps) {
    const selectedHost = sftpStore.getHostInMode(mode);
    const { t } = useTranslation('translation');
    const { theme } = useTheme();

    const [selectedSendFiles, setSelectedFiles] = useState<SftpFile[]>();
    const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
    const [server, setServer] = useState<ServerData>(null);
    const [isLoad, setLoad] = useState<boolean>(false);
    const [size, setSize] = useState<number>();
    const [errros, setErrors] = useState<Record<string, string[]>>({});
    const [remotePath, setRemotePath] = useState<string>('');
    const [closeStateModal, setCloseStateModal] = useState<boolean>(false)

    const sendFilesHandler = async () => {
        if (remotePath.length === 0) {
            setErrors(prevErrors => {
                return {
                    ...prevErrors,
                    RemotePath: ['Путь к директории должен быть указан']
                }
            });

            return;
        }

        if (size >= HostService.MaximumSendBytes) {
            setErrors(prevErrors => {
                return {
                    ...prevErrors,
                    Size: ['Превышен лимит размера отправки файлов или папок']
                }
            });

            return;
        }

        const existServiceResult = await SftpService.existFolderOrFile({
            serverId: server.serverId,
            folderOrFilePath: remotePath
        })

        if (existServiceResult.isSuccess && existServiceResult.result) {
            setCloseStateModal(false);

            selectedHost.modalOption.sendState = false;

            const cancelToken = HostService.getCancelToken();

            selectedHost.notificationOptions = {
                data: {
                    operationName: 'Отправка запроса на отправление файлов',
                    isProgress: false
                },
                onCancel: () => {
                    cancelToken.cancel('Request canceled by the user')
                }
            }

            const sendResult = await SftpService.sendFoldersOrFiles({
                foldersOrFilesToSendList: selectedSendFiles,
                targetServerId: server.serverId,
                sourceServerId: selectedHost.server.serverId,
                remotePath,
                connectionId: selectedHost.sftpHub.getConnectionId()
            }, cancelToken);

            if (!sendResult.isSuccess && sendResult.result?.errors) {
                if (Object.keys(sendResult.result?.errors).length > 0) {
                    selectedHost.error = { errors: sendResult.result?.errors }
                    selectedHost.modalOption.errorState = true;
                }
            }

            if (!sendResult.isSuccess) {
                selectedHost.error = { errors: sendResult.result?.errors }
                selectedHost.modalOption.errorState = true;
            }

            selectedHost.notificationOptions = null;
        }

        if (existServiceResult.isSuccess && !existServiceResult.result) {
            setErrors(prevErrors => {
                return {
                    ...prevErrors,
                    RemotePath: ['Путь к директории не найден']
                }
            });

            return;
        }

        if (!existServiceResult.isSuccess) {
            selectedHost.modalOption.sendState = false
            selectedHost.error = { errors: existServiceResult.errors }
            selectedHost.modalOption.errorState = true;
        }
    }

    const onChangeSelectHandler = (selectedItem: SelectedItem) => {
        if (!selectedItem) {
            setSelectedItem(null);
            setServer(null);
            return;
        }

        const server = userStore.userServers?.find(p => p.serverId.toString() === selectedItem.id);

        if (server) {
            setServer(server);
            setSelectedItem(selectedItem);
        }
    }

    const onChangeRemotePathHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors(prevErrors => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors.RemotePath;
            return updatedErrors;
        });

        setRemotePath(e.target.value);
    }

    useEffect(() => {
        if (selectedHost?.sftpFilesOption.fileList) {
            const selectedFilesItems = selectedHost.sftpFilesOption.fileList
                .filter(p => p.isSelected);

            setSelectedFiles(selectedFilesItems);
        }
    }, [selectedHost?.sftpFilesOption.fileList]);

    useEffect(() => {
        if (server) {
            setLoad(true)

            SftpService.getSizeFoldersOrFiles({
                serverId: selectedHost?.server.serverId,
                foldersOrFiles: selectedSendFiles
            }).then(result => {
                setLoad(false)

                if (result.isSuccess) {
                    setSize(result.result);
                }

                if (!result.isSuccess) {
                    selectedHost.modalOption.sendState = false
                    selectedHost.error = { errors: result.errors }
                    selectedHost.modalOption.errorState = true;
                }
            })
        }
    }, []);

    useEffect(() => {
        if (selectedSendFiles && selectedSendFiles.length === 0) {
            selectedHost.modalOption.sendState = false
        }
    }, [selectedSendFiles])

    return (
        <Modal
            options={{
                type: TypeModal.FORM,
                onCancel: () => { selectedHost.modalOption.sendState = false; },
                onConfirm: sendFilesHandler,
                headerName: t('Отправить файлы на другой сервер'),
                disabled: isLoad || Object.keys(errros).length > 0 || !server,
                isCloseConfirm: closeStateModal
            }}
            className={ classNames(style.send_modal, {}, [className]) }
            theme={ theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK }
            isVisible={ selectedHost?.modalOption?.sendState }
        >
            <div className={classNames(style.select_server_panel)}>
                <Select
                    placeholder={t('Выбрать сервер')}
                    selectedItem={selectedItem}
                    onChange={onChangeSelectHandler}
                >
                    {userStore.userServers?.map(server => (
                        <SelectItem
                            key={server.serverId}
                            selectedItem={{ id: server.serverId.toString(), title: server.title }}
                            isSelected={selectedItem?.id === server.serverId.toString() }
                            icon={
                                server.systemTypeIcon
                                    ? <img
                                        src={`${HostService._resourceHost}${server.systemTypeIcon}`}
                                        width={22}
                                        height={22}
                                        alt={'server_icon'}
                                    />
                                    : <DefaultServerIcon width={14} height={14}/>
                            }
                        />
                    ))}
                </Select>
            </div>
            {server && <div className={classNames(style.send_path_panel)}>
                <div className={classNames(style.path_label)}>{t('Путь к директории сервера')}:</div>
                <Input
                    className={classNames(style.server_path_input)}
                    placeholder={t('Путь к директории')}
                    errors={errros.RemotePath}
                    value={remotePath}
                    onChange={onChangeRemotePathHandler}
                />
            </div>}
            {<div className={classNames(style.sended_files_panel, { [style.load]: isLoad })}>
                {isLoad && <Loader className={classNames(style.loader)}/> }
                {size && <div className={classNames(style.size_label)}>{`${t('Размер выделенных папок и файлов: ')} 
                    ${formatFileSize(size)}`}
                    <div className={classNames(style.size_error)}>{errros.Size}</div>
                </div>}
                <div className={classNames(style.files_list_label)}>{t('Выбранные файлы для отправки')}</div>
                <div className={classNames(style.files_list)}>
                    {selectedSendFiles?.map((file, index) => (
                        <div className={classNames(style.file_item)} key={file.path}>
                            <div className={classNames(style.file_title)}>
                                <div className={classNames(style.file_icon)}>
                                    {file.fileType === FileType.File && <FileIcon width={25} height={25}/>}
                                    {file.fileType === FileType.Folder && <FolderIcon width={25} height={25}/>}
                                </div>
                                <div className={classNames(style.file_label)}>{file.name}</div>
                            </div>
                            <Button
                                className={classNames(style.remove_file)}
                                onClick={() => {
                                    selectedSendFiles.splice(index, 1);

                                    setSelectedFiles([...selectedSendFiles])
                                }}
                            >
                                <div></div>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>}
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

export default observer(SendModal)
