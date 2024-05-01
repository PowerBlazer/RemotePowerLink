import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import sftpStore from 'app/store/sftpStore';

interface UnloadProps extends MenuOptionProp {
    className?: string;
}

export function Upload ({ className, disabled, mode, onClick }: UnloadProps) {
    const { t } = useTranslation('translation');
    const selectedHost = sftpStore.getSelectedHostInMode(mode);

    const onClickUnloadHandler = () => {
        if (disabled) { return; }

        if (selectedHost?.sftpFileList) { selectedHost.modalOption.uploadState = true; }

        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.unload, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickUnloadHandler}
        >
            {t('Загрузить')}
        </Button>
    );
}
