import { classNames } from 'shared/lib/classNames/classNames';
import { observer } from 'mobx-react-lite';
import { createRef, useEffect, useMemo, useState } from 'react';
import { Button, ThemeButton } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { SftpSelectHostCatalog } from 'widgets/SftpSelectHostCatalog';
import { NavbarSftp } from 'widgets/NavbarSftp';
import { SftpCatalogTable } from 'widgets/SftpCatalogTable';
import { SftpCatalogMode } from 'app/services/SftpService/config/sftpConfig';
import SftpHub from 'app/hubs/SftpHub';
import toast from 'react-hot-toast';
import sftpStore from 'app/store/sftpStore';
import LogoIcon from 'shared/assets/icons/logo.svg';
import style from './SftpCatalog.module.scss';
import { NewFolderModal } from 'widgets/NewFolderModal';
import { ErrorModal } from 'widgets/ErrorModal';
import {DeleteModal} from "widgets/DeleteModal";

export interface SftpCatalogModeProps {
    mode: SftpCatalogMode
}

interface SftpCatalogProps extends SftpCatalogModeProps {
    className?: string;
}

function SftpCatalog ({ className, mode }: SftpCatalogProps) {
    const { t } = useTranslation('translation');
    const [isViewServersCatalog, setIsView] = useState<boolean>(false);
    const [isViewErrorPanel, setIsViewErrorPanel] = useState<boolean>(false);
    const catalogRef = createRef<HTMLDivElement>();
    const selectedHost = sftpStore.getSelectedHostInMode(mode);

    const getIsSelectedServer = () => {
        if (mode === SftpCatalogMode.First && sftpStore.firstSelectedHost != null) {
            return true;
        }

        return mode === SftpCatalogMode.Second && sftpStore.secondSelectedHost != null;
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

                sftpHub.events((files) => {
                    sftpStore.firstSelectedHost.sftpFileList = files
                    sftpStore.firstSelectedHost.isLoad = false;
                    sftpStore.setFileItems(mode)
                });

                await sftpHub.getFilesServer(sftpStore.firstSelectedHost.server.serverId);
            }

            sftpHub.onError = (errors) => {
                if (sftpStore.firstSelectedHost) {
                    sftpStore.firstSelectedHost = {
                        ...sftpStore.firstSelectedHost,
                        isLoad: false,
                        error: { errors }
                    }

                    sftpStore.firstSelectedHost.sftpFilesOption.historyPrevPaths.pop();
                    sftpStore.firstSelectedHost.modalOption.errorState = true;
                }

                toast.error(JSON.stringify(errors))
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

                sftpHub.events((files) => {
                    sftpStore.secondSelectedHost.sftpFileList = files
                    sftpStore.secondSelectedHost.isLoad = false;

                    sftpStore.setFileItems(mode)
                });

                await sftpHub.getFilesServer(sftpStore.secondSelectedHost.server.serverId);
            }

            sftpHub.onError = (errors) => {
                if (sftpStore.secondSelectedHost) {
                    sftpStore.secondSelectedHost = {
                        ...sftpStore.secondSelectedHost,
                        isLoad: false,
                        error: { errors }
                    }

                    sftpStore.secondSelectedHost.sftpFilesOption.historyPrevPaths.pop();
                }

                toast.error(JSON.stringify(errors))
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

    const selectHostInformationBlock = useMemo(() => (
        <div className={classNames(style.host_information_block)}>
            <LogoIcon width={180} height={156}/>
            <div className={classNames(style.information_content)}>
                <div className={classNames(style.header_information)}>
                    <h1>{t('Подключиться к серверу')}</h1>
                    <h3>{t('Выберите из вашего сохраненного сервера')}</h3>
                </div>
                <Button
                    className={classNames(style.select_server)}
                    theme={ThemeButton.PRIMARY}
                    onClick={() => { setIsView(true); }}
                >
                    {t('Выбрать сервер')}
                </Button>
            </div>
        </div>
    ), []);

    if (getIsSelectedServer() && !isViewServersCatalog && !isViewErrorPanel) {
        return (
            <div className={classNames(style.sftpCatalog, {}, [className])} ref={catalogRef}>
                <NavbarSftp mode={mode} onOpenCatalog={() => { setIsView(true); }}/>
                <SftpCatalogTable mode={mode}/>
                { selectedHost.modalOption.newFolderState && <NewFolderModal mode={mode}/> }
                { selectedHost.modalOption.errorState && <ErrorModal mode={mode}/> }
                { selectedHost.modalOption.deleteState && <DeleteModal mode={mode}/> }
            </div>
        )
    }

    return (
        <div className={classNames(style.sftpCatalog, {}, [className])} ref={catalogRef}>
            { !getIsSelectedServer() && !isViewServersCatalog && selectHostInformationBlock }
            { isViewServersCatalog && <SftpSelectHostCatalog mode={mode} onClose={() => { setIsView(false); }}/> }
        </div>
    );
}

export default observer(SftpCatalog)
