import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpModules/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import sftpStore from 'app/store/sftpStore';
import useSftp from 'app/hooks/useSftp';

interface DeleteProps extends MenuOptionProp {
    className?: string;
}

export function Delete ({ className, disabled, windowsIndex, onClick }: DeleteProps) {
    const { t } = useTranslation('translation');
    const { getHost } = useSftp(windowsIndex);

    const selectedHost = getHost();

    const onClickDeleteHandler = () => {
        if (disabled) { return; }

        if (selectedHost) {
            selectedHost.modalOption.deleteState = true;
        }

        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.delete, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickDeleteHandler}
        >
            {t('Удалить')}
        </Button>
    );
}
