import { classNames } from 'shared/lib/classNames/classNames';
import { observer } from 'mobx-react-lite';
import { createRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SftpSelectHostCatalog } from 'widgets/SftpModules/SftpSelectHostCatalog';
import { NavbarSftp } from 'widgets/SftpModules/NavbarSftp';
import { SftpCatalogTable } from 'widgets/SftpModules/SftpCatalogTable';
import toast from 'react-hot-toast';
import sftpStore from 'app/store/sftpStore';
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
import { UploadModal } from 'widgets/SftpModules/SftpModals/UploadModal';
import { SendModal } from 'widgets/SftpModules/SftpModals/SendModal';
import { PageConnectionError } from 'widgets/PageConnectionError';
import { SelectHostBlock } from 'features/SelectHostBlock/ui/SelectHostBlock';
import useSftp from 'app/hooks/useSftp';

export interface SftpWindowsOptionProps {
    windowsIndex: number
}

interface SftpCatalogProps extends SftpWindowsOptionProps {
    className?: string;
}

function SftpCatalog ({ className, windowsIndex }: SftpCatalogProps) {
    const { initialSftp, closeSftp, getHost } = useSftp(windowsIndex);
    const { t } = useTranslation('translation');
    const selectedHost = getHost();

    const [isViewServersCatalog, setIsView] = useState<boolean>(false);
    const [isViewErrorPanel, setIsViewErrorPanel] = useState<boolean>(Boolean(selectedHost?.errors?.Connection));

    const catalogRef = createRef<HTMLDivElement>();
    const location = useNavigate();

    const closeConnectionServer = async () => {
        await closeSftp();

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

        await reconnectHost();
    }

    useEffect(() => {
        initialSftp(() => {
            setIsViewErrorPanel(true);
        });
    }, [selectedHost]);

    useEffect(() => {
        if (catalogRef && selectedHost) {
            selectedHost.sftpFilesOption.widthPanel = catalogRef.current.offsetWidth;
        }
    }, [sftpStore.editableWidthSplit, catalogRef]);

    if (selectedHost && !isViewServersCatalog && !isViewErrorPanel) {
        return (
            <div className={classNames(style.sftpCatalog, {}, [className])} ref={catalogRef}>
                <NavbarSftp windowsIndex={windowsIndex} onOpenCatalog={() => { setIsView(true); }}/>
                <SftpCatalogTable windowsIndex={windowsIndex}/>
                { selectedHost?.modalOption.newFolderState && <NewFolderModal windowsIndex={windowsIndex}/> }
                { selectedHost?.modalOption.errorState && <ErrorModal windowsIndex={windowsIndex}/> }
                { selectedHost?.modalOption.deleteState && <DeleteModal windowsIndex={windowsIndex}/> }
                { selectedHost?.modalOption.renameState && <RenameModal windowsIndex={windowsIndex}/> }
                { selectedHost?.modalOption.downloadState && <DownloadModal windowsIndex={windowsIndex}/> }
                { selectedHost?.modalOption.uploadState && <UploadModal windowsIndex={windowsIndex}/> }
                { selectedHost?.modalOption.sendState && <SendModal windowsIndex={windowsIndex}/> }
                <SftpNotificationPanel windowsIndex={windowsIndex}/>
            </div>
        )
    }

    return (
        <div className={classNames(style.sftpCatalog, {}, [className])} ref={catalogRef}>
            { !selectedHost && !isViewServersCatalog &&
                <SelectHostBlock onClick={() => { setIsView(true); }} />
            }
            { isViewErrorPanel &&
                <PageConnectionError
                    windowsIndex={windowsIndex}
                    onCloseConnectionServer={closeConnectionServer}
                    onReconnectHost={reconnectHost}
                    onSwitchEditingHostMode={switchEditingHostMode}
                />
            }
            { isViewServersCatalog && <SftpSelectHostCatalog windowsIndex={windowsIndex} onClose={() => { setIsView(false); }}/> }
        </div>
    );
}

export default observer(SftpCatalog)
