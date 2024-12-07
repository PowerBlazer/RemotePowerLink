import { MenuOptionProp } from 'features/SftpModules/SftpMenuOptions';
import style from './SftpMenuOptions.module.scss';
import { classNames } from 'shared/lib/classNames/classNames';
import { Button } from 'shared/ui/Button/Button';
import sftpStore, { MenuMode, SftpModalOption, SftpServer } from 'app/store/sftpStore';
import { useTranslation } from 'react-i18next';
import { Stack } from 'shared/lib/Stack';
import { SftpCatalogMode } from 'app/services/SftpService/config';
import useSftp from 'app/hooks/useSftp';

interface ReconnectProps extends MenuOptionProp {
    className?: string;
}

export function Reconnect ({ className, mode, disabled, onClick }: ReconnectProps) {
    const selectedHost = sftpStore.getHostInMode(mode);
    const { t } = useTranslation('translation');
    const { reconnectSftp } = useSftp(mode);

    const onClickReconnectHandler = async () => {
        if (disabled) { return; }

        await reconnectSftp();

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
