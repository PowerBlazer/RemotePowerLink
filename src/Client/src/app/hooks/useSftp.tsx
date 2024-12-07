import sftpStore, { MenuMode, SftpModalOption, SftpNotificationData, SftpServer } from 'app/store/sftpStore';
import { SftpCatalogMode } from 'app/services/SftpService/config';
import SftpHub from 'app/hubs/sftpHub';
import toast from 'react-hot-toast';
import { ConnectionState } from 'app/hubs/hubFactory';
import { Stack } from 'shared/lib/Stack';
import { ServerData } from 'app/services/ServerService/config/serverConfig';

const useSftp = (mode: SftpCatalogMode) => {
    function initialSftp (onError: () => void) {
        const host = sftpStore.getHostInMode(mode);

        if (host) {
            const sftpHub = new SftpHub();

            host.isLoad = true;

            sftpHub.onConnect = async () => {
                host.sftpHub = sftpHub;
                sftpHub.events(
                    (files) => {
                        host.sftpFileList = files
                        host.isLoad = false;
                        sftpStore.setFileItems(mode)
                    },
                    (downloadData) => { notificationDownloadOrUploadHandler(downloadData, mode); },
                    (uploadData) => { notificationDownloadOrUploadHandler(uploadData, mode); },
                    (sendData) => { notificationDownloadOrUploadHandler(sendData, mode) }
                );

                await sftpHub.getFilesServer(host.server.serverId);
            }

            sftpHub.onError = (errors) => {
                if (errors?.Connection && onError) {
                    onError();
                }

                if (host) {
                    host.error = { errors };
                    host.isLoad = false;
                    host.modalOption.errorState = true;
                }

                toast.error(Object.values(errors).join('\n'));
            }
        }
    }

    async function closeSftp () {
        const selectedHost = sftpStore.getHostInMode(mode);
        if (selectedHost?.sftpHub.getConnectionState() === ConnectionState.Connected) {
            await selectedHost?.sftpHub.closeConnection();
        }

        sftpStore.setHostInMode(mode, null);
    }
    async function reconnectSftp () {
        const selectedHost = sftpStore.getHostInMode(mode);

        if (selectedHost) {
            initialSftpInstance(selectedHost.server);
        }
    }
    async function connectSftp (serverData: ServerData) {
        initialSftpInstance(serverData);
    }

    const initialSftpInstance = (serverData: ServerData) => {
        const modalOptions: SftpModalOption = {
            errorState: false,
            newFolderState: false,
            deleteState: false,
            renameState: false,
            downloadState: false,
            uploadState: false,
            sendState: false
        }

        const newHostInstance: SftpServer = {
            server: serverData,
            isLoad: false,
            menuOption: {
                isVisible: false,
                menuMode: MenuMode.Default
            },
            sftpFilesOption: {
                filterOptions: {},
                historyPrevPaths: new Stack<string>(),
                historyNextPaths: new Stack<string>()
            },
            modalOption: modalOptions
        }

        const selectedHost = sftpStore.getHostInMode(mode);

        if (selectedHost?.sftpHub) {
            selectedHost.sftpHub.closeConnection();
        }

        sftpStore.setHostInMode(mode, newHostInstance);
    }
    const notificationDownloadOrUploadHandler = (notificationData: SftpNotificationData, mode: SftpCatalogMode) => {
        const selectedHost = sftpStore.getHostInMode(mode);

        if (selectedHost.notificationOptions) {
            selectedHost.notificationOptions = {
                ...selectedHost.notificationOptions,
                data: notificationData
            }
        }
    }

    return {
        initialSftp,
        closeSftp,
        reconnectSftp,
        connectSftp
    }
}

export default useSftp;
