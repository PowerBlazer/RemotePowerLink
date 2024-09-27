import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpModules/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import { SftpCatalogMode } from 'app/services/SftpService/config';
import sftpStore from 'app/store/sftpStore';
import { useTranslation } from 'react-i18next';

interface CloseProps extends MenuOptionProp {
    className?: string;
}

export function Close ({ className, mode, disabled, onClick }: CloseProps) {
    const { t } = useTranslation('translation')
    const onClickCloseHandler = () => {
        if (disabled) { return; }

        if (mode === SftpCatalogMode.First && sftpStore.firstSelectedHost) {
            sftpStore.firstSelectedHost.sftpHub.closeConnection();
            sftpStore.firstSelectedHost = null;
        }

        if (mode === SftpCatalogMode.Second && sftpStore.secondSelectedHost) {
            sftpStore.secondSelectedHost.sftpHub.closeConnection();
            sftpStore.secondSelectedHost = null;
        }

        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.close, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickCloseHandler}
        >
            {t('Закрыть подключение')}
        </Button>
    );
}
