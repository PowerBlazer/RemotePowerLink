import { classNames } from 'shared/lib/classNames/classNames';
import { observer } from 'mobx-react-lite';
import { createRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SftpSelectHostCatalog } from 'widgets/SftpModules/SftpSelectHostCatalog';
import { NavbarSftp } from 'widgets/SftpModules/NavbarSftp';
import { SftpCatalogTable } from 'widgets/SftpModules/SftpCatalogTable';
import { SftpCatalogMode } from 'app/services/SftpService/config';
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

export interface SftpCatalogModeProps {
    mode: SftpCatalogMode
}

interface SftpCatalogProps extends SftpCatalogModeProps {
    className?: string;
}

function SftpCatalog ({ className, mode }: SftpCatalogProps) {
    const selectedHost = sftpStore.getHostInMode(mode);

    const { initialSftp, closeSftp } = useSftp(mode);
    const { t } = useTranslation('translation');

    const [isViewServersCatalog, setIsView] = useState<boolean>(false);
    const [isViewErrorPanel, setIsViewErrorPanel] = useState<boolean>(
        Boolean(selectedHost?.error?.errors?.Connection)
    );

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
                <NavbarSftp mode={mode} onOpenCatalog={() => { setIsView(true); }}/>
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
            { !selectedHost && !isViewServersCatalog &&
                <SelectHostBlock onClick={() => { setIsView(true); }} />
            }
            { isViewErrorPanel &&
                <PageConnectionError
                    mode={mode}
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
