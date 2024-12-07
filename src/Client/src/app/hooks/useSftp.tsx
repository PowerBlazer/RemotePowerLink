import sftpStore, {
    MenuMode,
    SftpModalOption,
    SftpNotificationData,
    SftpServer,
    SftpScreenSplitMode
} from 'app/store/sftpStore';
import SftpHub from 'app/hubs/sftpHub';
import toast from 'react-hot-toast';
import { ConnectionState } from 'app/hubs/hubFactory';
import { Stack } from 'shared/lib/Stack';
import { ServerData } from 'app/services/ServerService/config/serverConfig';

const useSftp = (windowIndex: SftpScreenSplitMode) => {
    function initialSftp (onError: () => void) {
        const host = sftpStore.getHostInMode(windowIndex);

        if (host && !host.sftpHub) {
            const sftpHub = new SftpHub();

            host.isLoad = true;

            sftpHub.onConnect = async () => {
                host.sftpHub = sftpHub;
                sftpHub.events(
                    (files) => {
                        host.sftpFileList = files
                        host.isLoad = false;
                        sftpStore.setFileItems(windowIndex)
                    },
                    (downloadData) => { notificationDownloadOrUploadHandler(downloadData); },
                    (uploadData) => { notificationDownloadOrUploadHandler(uploadData); },
                    (sendData) => { notificationDownloadOrUploadHandler(sendData) }
                );

                await sftpHub.getFilesServer(host.server.serverId);
            }

            sftpHub.onError = (errors) => {
                if (errors?.Connection && onError) {
                    onError();
                }

                if (host) {
                    host.errors = errors;
                    host.isLoad = false;
                    host.modalOption.errorState = true;
                }

                toast.error(Object.values(errors).join('\n'));
            }
        }
    }
    function getHost(){
        return sftpStore.getHostInMode(windowIndex);
    }
    async function closeSftp () {
        const selectedHost = sftpStore.getHostInMode(windowIndex);
        if (selectedHost?.sftpHub.getConnectionState() === ConnectionState.Connected) {
            await selectedHost?.sftpHub.closeConnection();
        }

        sftpStore.setHostInMode(windowIndex, null);
    }
    async function reconnectSftp () {
        const selectedHost = getHost();

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

        const selectedHost = getHost();

        if (selectedHost?.sftpHub) {
            selectedHost.sftpHub.closeConnection();
        }

        sftpStore.setHostInMode(windowIndex, newHostInstance);
    }
    const notificationDownloadOrUploadHandler = (notificationData: SftpNotificationData) => {
        const selectedHost = getHost();

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
        connectSftp,
        getHost
    }
}

export default useSftp;
