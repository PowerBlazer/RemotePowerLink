import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';

interface DownloadProps extends MenuOptionProp {
    className?: string;
}

export function Download ({ className, mode, disabled, onClick }: DownloadProps) {
    const { t } = useTranslation('translation');
    const onClickDownloadHandler = () => {
        if (disabled) { return; }

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
