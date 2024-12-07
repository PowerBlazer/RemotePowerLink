import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpModules/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import useSftp from 'app/hooks/useSftp';

interface CloseProps extends MenuOptionProp {
    className?: string;
}

export function Close ({ className, mode, disabled, onClick }: CloseProps) {
    const { t } = useTranslation('translation');
    const { closeSftp } = useSftp(mode);
    const onClickCloseHandler = async () => {
        if (disabled) { return; }

        await closeSftp();

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
