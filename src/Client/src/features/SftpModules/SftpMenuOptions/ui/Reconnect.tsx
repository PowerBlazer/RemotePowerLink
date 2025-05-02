import { MenuOptionProp } from 'features/SftpModules/SftpMenuOptions';
import style from './SftpMenuOptions.module.scss';
import { classNames } from 'shared/lib/classNames/classNames';
import { Button } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import useSftp from 'app/hooks/useSftp';

interface ReconnectProps extends MenuOptionProp {
    className?: string;
}

export function Reconnect ({ className, windowsIndex, disabled, onClick }: ReconnectProps) {
    const { t } = useTranslation('translation');
    const { reconnectSftp, getHost } = useSftp(windowsIndex);

    const selectedHost = getHost();

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
