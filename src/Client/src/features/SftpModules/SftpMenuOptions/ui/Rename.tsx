import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpModules/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import sftpStore from 'app/store/sftpStore';
import useSftp from "app/hooks/useSftp";

interface RenameProps extends MenuOptionProp {
    className?: string;
}

export function Rename ({ className, disabled, windowsIndex, onClick }: RenameProps) {
    const { t } = useTranslation('translation');
    const { getHost } = useSftp(windowsIndex);

    const selectedHost = getHost();
    
    const onClickRenameHandler = () => {
        if (disabled) { return; }

        if (selectedHost) {
            selectedHost.modalOption.renameState = true;
        }

        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.rename, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickRenameHandler}
        >
            {t('Переименовать')}
        </Button>
    );
}
