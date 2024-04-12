import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import sftpStore from 'app/store/sftpStore';

interface RefreshProps extends MenuOptionProp {
    className?: string;
}

export function Refresh ({ className, disabled, mode, onClick }: RefreshProps) {
    const onClickRefreshHandler = () => {
        if (disabled) { return; }

        const selectedHost = sftpStore.getSelectedHostInMode(mode);
        if (selectedHost) {
            selectedHost.isLoad = true;
            selectedHost.sftpHub.getFilesServer(selectedHost.server.serverId, selectedHost.sftpFileList.currentPath)
        }

        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.refresh, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickRefreshHandler}
        >
            Refresh
        </Button>
    );
}
