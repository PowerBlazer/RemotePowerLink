import { classNames } from 'shared/lib/classNames/classNames';
import { observer } from 'mobx-react-lite';
import { createRef, useEffect, useState } from 'react';
import { SftpSelectHostCatalog } from 'widgets/SftpModules/SftpSelectHostCatalog';
import { NavbarSftp } from 'widgets/SftpModules/NavbarSftp';
import { SftpCatalogTable } from 'widgets/SftpModules/SftpCatalogTable';
import { NewFolderModal } from 'widgets/SftpModules/SftpModals/NewFolderModal';
import { ErrorModal } from 'widgets/SftpModules/SftpModals/ErrorModal';
import { DeleteModal } from 'widgets/SftpModules/SftpModals/DeleteModal';
import { RenameModal } from 'widgets/SftpModules/SftpModals/RenameModal';
import { DownloadModal } from 'widgets/SftpModules/SftpModals/DownloadModal';
import { SftpNotificationPanel } from 'widgets/SftpModules/SftpNotificationPanel';
import { SidebarEditHost } from 'widgets/Sidebars/SidebarEditHost';
import { useNavigate } from 'react-router-dom';
import { UploadModal } from 'widgets/SftpModules/SftpModals/UploadModal';
import { SendModal } from 'widgets/SftpModules/SftpModals/SendModal';
import { PageConnectionError } from 'widgets/PageConnectionError';
import { SelectHostBlock } from 'features/SelectHostBlock/ui/SelectHostBlock';

import useSftp from 'app/hooks/useSftp';
import sftpStore from 'app/store/sftpStore';
import style from './SftpCatalog.module.scss';
import userStore from 'app/store/userStore';
import sidebarStore from 'app/store/sidebarStore';

export interface SftpWindowsOptionProps {
    windowsIndex: number
}

interface SftpCatalogProps extends SftpWindowsOptionProps {
    className?: string;
}

function SftpCatalog ({ className, windowsIndex }: SftpCatalogProps) {
    const { initialSftp, closeSftp, getHost, reconnectSftp } = useSftp(windowsIndex);
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
        if (selectedHost) {
            sidebarStore.mainSidebar.editHostData.data = selectedHost?.server;

            await sidebarStore.setSidebar(sidebarStore.mainSidebar, null);
            await sidebarStore.setSidebar(sidebarStore.mainSidebar, {
                name: `SidebarEditHost ${selectedHost?.server.serverId}`,
                element: <SidebarEditHost isMain={true}/>
            });

            userStore.location = '/'
            location('/');
        }
    }
    const reconnectHost = async () => {
        setIsViewErrorPanel(false);

        await reconnectSftp()
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
