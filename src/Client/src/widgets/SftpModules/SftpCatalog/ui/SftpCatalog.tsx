import { classNames } from 'shared/lib/classNames/classNames';
import { observer } from 'mobx-react-lite';
import { createRef, useEffect, useMemo, useState } from 'react';
import { Button, ThemeButton } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { SftpSelectHostCatalog } from 'widgets/SftpModules/SftpSelectHostCatalog';
import { NavbarSftp } from 'widgets/SftpModules/NavbarSftp';
import { SftpCatalogTable } from 'widgets/SftpModules/SftpCatalogTable';
import { SftpCatalogMode } from 'app/services/SftpService/config';
import SftpHub from 'app/hubs/sftpHub';
import toast from 'react-hot-toast';
import sftpStore, { SftpModalOption, SftpNotificationData } from 'app/store/sftpStore';
import LogoIcon from 'shared/assets/icons/logo.svg';
import style from './SftpCatalog.module.scss';
import { NewFolderModal } from 'widgets/SftpModules/SftpModals/NewFolderModal';
import { ErrorModal } from 'widgets/SftpModules/SftpModals/ErrorModal';
import { DeleteModal } from 'widgets/SftpModules/SftpModals/DeleteModal';
import { RenameModal } from 'widgets/SftpModules/SftpModals/RenameModal';
import { DownloadModal } from 'widgets/SftpModules/SftpModals/DownloadModal';
import { SftpNotificationPanel } from 'widgets/SftpModules/SftpNotificationPanel';
import sidebarStore from 'app/store/sidebarStore';
import { SidebarEditHost } from 'widgets/Sidebars/SidebarEditHost';
import { EditServerResult } from 'app/services/ServerService/config/serverConfig';
import userStore from 'app/store/userStore';
import { useNavigate } from 'react-router-dom';
import { Stack } from 'shared/lib/Stack';
import { UploadModal } from 'widgets/SftpModules/SftpModals/UploadModal';
import { SendModal } from 'widgets/SftpModules/SftpModals/SendModal';
import { PageConnectionError } from 'widgets/PageConnectionError';
import { SelectHostBlock } from 'features/SelectHostBlock/ui/SelectHostBlock';
import { ConnectionState } from 'app/hubs/hubFactory';

export interface SftpCatalogModeProps {
    mode: SftpCatalogMode
}

interface SftpCatalogProps extends SftpCatalogModeProps {
    className?: string;
}

function SftpCatalog ({ className, mode }: SftpCatalogProps) {
    const selectedHost = sftpStore.getSelectedHostInMode(mode);

    const { t } = useTranslation('translation');
    const [isViewServersCatalog, setIsView] = useState<boolean>(false);

    const [isViewErrorPanel, setIsViewErrorPanel] = useState<boolean>(
        Boolean(selectedHost?.error?.errors?.Connection)
    );

    const catalogRef = createRef<HTMLDivElement>();
    const location = useNavigate();

    const getIsSelectedServer = () => {
        if (mode === SftpCatalogMode.First && sftpStore.firstSelectedHost != null) {
            return true;
        }

        return mode === SftpCatalogMode.Second && sftpStore.secondSelectedHost != null;
    }

    const closeConnectionServer = async () => {
        if (selectedHost?.sftpHub.getConnectionState() === ConnectionState.Connected) {
            await selectedHost?.sftpHub.closeConnection();
        }

        if (mode === SftpCatalogMode.First) {
            sftpStore.firstSelectedHost = null;
        }

        if (mode === SftpCatalogMode.Second) {
            sftpStore.secondSelectedHost = null
        }

        setIsView(false);
        setIsViewErrorPanel(false);
    }
    const switchEditingHostMode = async () => {
        const onEditServerHandler = async (editServerResult: EditServerResult) => {
            userStore.setUserServer({
                serverId: editServerResult.serverId,
                hostname: editServerResult.hostname,
                title: editServerResult.title,
                identityId: editServerResult.identityId,
                proxyId: editServerResult.proxyId,
                sshPort: editServerResult.sshPort,
                startupCommand: editServerResult.startupCommand,
                systemTypeIcon: editServerResult.systemTypeIcon,
                systemTypeName: editServerResult.systemTypeName,
                dateCreated: editServerResult.dateCreated,
                encodingId: editServerResult.encodingId
            });

            toast.success(t('Успешно сохранено'));
        }

        if (selectedHost) {
            sidebarStore.editHostData.server = selectedHost?.server;

            await sidebarStore.setSidebar(null);
            await sidebarStore.setSidebar({
                name: `SidebarEditHost ${selectedHost?.server.serverId}`,
                sidebar: <SidebarEditHost isMain={true} onSave={onEditServerHandler}/>
            });

            userStore.location = '/'
            location('/');
        }
    }
    const reconnectHost = async () => {
        setIsViewErrorPanel(false);

        const modalOptions: SftpModalOption = {
            errorState: false,
            newFolderState: false,
            deleteState: false,
            renameState: false,
            downloadState: false,
            uploadState: false,
            sendState: false
        }

        const newHostInstance = {
            server: selectedHost?.server,
            isLoad: false,
            sftpFilesOption: {
                filterOptions: {},
                historyPrevPaths: new Stack<string>(),
                historyNextPaths: new Stack<string>()
            },
            modalOption: modalOptions
        }

        if (mode === SftpCatalogMode.First) {
            if (sftpStore.firstSelectedHost?.sftpHub) {
                await sftpStore.firstSelectedHost.sftpHub.closeConnection();
            }

            sftpStore.firstSelectedHost = newHostInstance;
        }

        if (mode === SftpCatalogMode.Second) {
            if (sftpStore.secondSelectedHost?.sftpHub) {
                await sftpStore.secondSelectedHost.sftpHub.closeConnection();
            }

            sftpStore.secondSelectedHost = newHostInstance;
        }
    }

    const notificationDownloadOrUploadHandler = (notificationData: SftpNotificationData, mode: SftpCatalogMode) => {
        if (mode === SftpCatalogMode.First && sftpStore.firstSelectedHost.notificationOptions) {
            sftpStore.firstSelectedHost.notificationOptions = {
                ...sftpStore.firstSelectedHost.notificationOptions,
                data: notificationData
            }
        }

        if (mode === SftpCatalogMode.Second && sftpStore.secondSelectedHost.notificationOptions) {
            sftpStore.secondSelectedHost.notificationOptions = {
                ...sftpStore.secondSelectedHost.notificationOptions,
                data: notificationData
            }
        }
    }

    useEffect(() => {
        const isFirstSelectedHost = mode === SftpCatalogMode.First &&
            sftpStore.firstSelectedHost !== null &&
            !sftpStore.firstSelectedHost.sftpHub;

        if (isFirstSelectedHost) {
            const sftpHub = new SftpHub();

            sftpStore.firstSelectedHost.isLoad = true;

            sftpHub.onConnect = async () => {
                sftpStore.firstSelectedHost.sftpHub = sftpHub;
                sftpHub.events(
                    (files) => {
                        sftpStore.firstSelectedHost.sftpFileList = files
                        sftpStore.firstSelectedHost.isLoad = false;
                        sftpStore.setFileItems(mode)
                    },
                    (downloadData) => { notificationDownloadOrUploadHandler(downloadData, SftpCatalogMode.First); },
                    (uploadData) => { notificationDownloadOrUploadHandler(uploadData, SftpCatalogMode.First); },
                    (sendData) => { notificationDownloadOrUploadHandler(sendData, SftpCatalogMode.First) }
                );

                await sftpHub.getFilesServer(sftpStore.firstSelectedHost.server.serverId);
            }

            sftpHub.onError = (errors) => {
                if (errors?.Connection) {
                    setIsViewErrorPanel(true);
                }

                if (sftpStore.firstSelectedHost) {
                    sftpStore.firstSelectedHost = {
                        ...sftpStore.firstSelectedHost,
                        isLoad: false,
                        error: { errors }
                    }

                    sftpStore.firstSelectedHost.modalOption.errorState = true;
                }

                toast.error(Object.values(errors).join('\n'));
            }
        }
    }, [sftpStore.firstSelectedHost]);

    useEffect(() => {
        const isSecondSelectedHost = mode === SftpCatalogMode.Second &&
            sftpStore.secondSelectedHost !== null &&
            !sftpStore.secondSelectedHost.sftpHub;

        if (isSecondSelectedHost) {
            const sftpHub = new SftpHub();

            sftpStore.secondSelectedHost.isLoad = true;

            sftpHub.onConnect = async () => {
                sftpStore.secondSelectedHost.sftpHub = sftpHub;

                sftpHub.events(
                    (files) => {
                        sftpStore.secondSelectedHost.sftpFileList = files
                        sftpStore.secondSelectedHost.isLoad = false;

                        sftpStore.setFileItems(mode)
                    },
                    (downloadData) => { notificationDownloadOrUploadHandler(downloadData, SftpCatalogMode.Second); },
                    (uploadData) => { notificationDownloadOrUploadHandler(uploadData, SftpCatalogMode.Second); },
                    (sendData) => { notificationDownloadOrUploadHandler(sendData, SftpCatalogMode.Second) }
                );

                await sftpHub.getFilesServer(sftpStore.secondSelectedHost.server.serverId);
            }

            sftpHub.onError = (errors) => {
                if (errors?.Connection) {
                    setIsViewErrorPanel(true);
                }

                if (sftpStore.secondSelectedHost) {
                    sftpStore.secondSelectedHost = {
                        ...sftpStore.secondSelectedHost,
                        isLoad: false,
                        error: { errors }
                    }

                    sftpStore.secondSelectedHost.modalOption.errorState = true;
                }

                toast.error(Object.values(errors).join('\n'));
            }
        }
    }, [sftpStore.secondSelectedHost]);

    useEffect(() => {
        if (mode === SftpCatalogMode.First && catalogRef && sftpStore.firstSelectedHost) {
            sftpStore.firstSelectedHost.sftpFilesOption.widthPanel = catalogRef.current.offsetWidth;
        }

        if (mode === SftpCatalogMode.Second && catalogRef && sftpStore.secondSelectedHost) {
            sftpStore.secondSelectedHost.sftpFilesOption.widthPanel = catalogRef.current.offsetWidth;
        }
    }, [sftpStore.editableWidthSplit, catalogRef]);

    if (getIsSelectedServer() && !isViewServersCatalog && !isViewErrorPanel) {
        return (
            <div className={classNames(style.sftpCatalog, {}, [className])} ref={catalogRef}>
                <NavbarSftp mode={mode} onOpenCatalog={() => {
                    setIsView(true);
                }}/>
                <SftpCatalogTable mode={mode}/>
                { selectedHost?.modalOption.newFolderState && <NewFolderModal mode={mode}/> }
                { selectedHost?.modalOption.errorState && <ErrorModal mode={mode}/> }
                { selectedHost?.modalOption.deleteState && <DeleteModal mode={mode}/> }
                { selectedHost?.modalOption.renameState && <RenameModal mode={mode}/> }
                { selectedHost?.modalOption.downloadState && <DownloadModal mode={mode}/> }
                { selectedHost?.modalOption.uploadState && <UploadModal mode={mode}/> }
                { selectedHost?.modalOption.sendState && <SendModal mode={mode}/> }
                <SftpNotificationPanel mode={mode}/>
            </div>
        )
    }

    return (
        <div className={classNames(style.sftpCatalog, {}, [className])} ref={catalogRef}>
            { !getIsSelectedServer() && !isViewServersCatalog &&
                <SelectHostBlock onClick={() => { setIsView(true); }} />
            }
            { isViewErrorPanel &&
                <PageConnectionError
                    selectedHost={selectedHost}
                    onCloseConnectionServer={closeConnectionServer}
                    onReconnectHost={reconnectHost}
                    onSwitchEditingHostMode={switchEditingHostMode}
                />
            }
            { isViewServersCatalog && <SftpSelectHostCatalog mode={mode} onClose={() => { setIsView(false); }}/> }
        </div>
    );
}

export default observer(SftpCatalog)
