import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpModules/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import sftpStore from 'app/store/sftpStore';

interface RenameProps extends MenuOptionProp {
    className?: string;
}

export function Rename ({ className, disabled, mode, onClick }: RenameProps) {
    const { t } = useTranslation('translation');
    const selectedHost = sftpStore.getHostInMode(mode)
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
