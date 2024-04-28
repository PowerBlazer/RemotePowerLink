import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import sftpStore from 'app/store/sftpStore';
import { useTranslation } from 'react-i18next';

interface RefreshProps extends MenuOptionProp {
    className?: string;
}

export function Refresh ({ className, disabled, mode, onClick }: RefreshProps) {
    const { t } = useTranslation('translation');
    const onClickRefreshHandler = () => {
        if (disabled) { return; }

        const selectedHost = sftpStore.getSelectedHostInMode(mode);
        if (selectedHost?.sftpFileList) {
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
            {t('Обновить')}
        </Button>
    );
}
