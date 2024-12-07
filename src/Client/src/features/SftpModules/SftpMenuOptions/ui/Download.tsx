import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpModules/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import sftpStore from 'app/store/sftpStore';
import useSftp from "app/hooks/useSftp";

interface DownloadProps extends MenuOptionProp {
    className?: string;
}

export function Download ({ className, windowsIndex, disabled, onClick }: DownloadProps) {
    const { t } = useTranslation('translation');
    const { getHost } = useSftp(windowsIndex);

    const selectedHost = getHost();
    
    const onClickDownloadHandler = () => {
        if (disabled) { return; }

        if (selectedHost) {
            selectedHost.modalOption.downloadState = true;
        }

        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.download, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickDownloadHandler}
        >
            {t('Скачать')}
        </Button>
    );
}
