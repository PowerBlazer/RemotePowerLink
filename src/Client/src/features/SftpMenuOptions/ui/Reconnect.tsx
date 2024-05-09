import { MenuOptionProp } from 'features/SftpMenuOptions';
import style from './SftpMenuOptions.module.scss';
import { classNames } from 'shared/lib/classNames/classNames';
import { Button } from 'shared/ui/Button/Button';
import sftpStore, { MenuMode, SftpModalOption, SftpServer } from 'app/store/sftpStore';
import { useTranslation } from 'react-i18next';
import { Stack } from 'shared/lib/Stack';
import { SftpCatalogMode } from 'app/services/SftpService/config';

interface ReconnectProps extends MenuOptionProp {
    className?: string;
}

export function Reconnect ({ className, mode, disabled, onClick }: ReconnectProps) {
    const selectedHost = sftpStore.getSelectedHostInMode(mode);
    const { t } = useTranslation('translation');

    const onClickReconnectHandler = () => {
        if (disabled) { return; }

        if (selectedHost) {
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
                server: selectedHost?.server,
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

            if (mode === SftpCatalogMode.First) {
                if (sftpStore.firstSelectedHost?.sftpHub) {
                    sftpStore.firstSelectedHost.sftpHub.closeConnection();
                }

                sftpStore.firstSelectedHost = newHostInstance;
            }

            if (mode === SftpCatalogMode.Second) {
                if (sftpStore.secondSelectedHost?.sftpHub) {
                    sftpStore.secondSelectedHost.sftpHub.closeConnection();
                }

                sftpStore.secondSelectedHost = newHostInstance;
            }
        }

        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.refresh, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickReconnectHandler}
        >
            {t('Переподключиться')}
        </Button>
    );
}
