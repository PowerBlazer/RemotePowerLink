import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpModules/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import sftpStore from 'app/store/sftpStore';
import { useTranslation } from 'react-i18next';
import useSftp from 'app/hooks/useSftp';

interface SelectAllProps extends MenuOptionProp {
    className?: string;
}

export function SelectAll ({ className, disabled, windowsIndex, onClick }: SelectAllProps) {
    const { t } = useTranslation('translation');
    const { getHost } = useSftp(windowsIndex);

    const selectedHost = getHost();

    const onClickSelectAllHandler = () => {
        if (disabled) { return; }

        if (selectedHost?.sftpFileList) { sftpStore.setSelectAllInFilter(windowsIndex); }

        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.selectAll, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickSelectAllHandler}
        >
            {t('Выбрать все')}
        </Button>
    );
}
