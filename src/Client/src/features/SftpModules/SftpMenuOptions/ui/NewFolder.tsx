import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpModules/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import sftpStore from 'app/store/sftpStore';
import { Tr } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface NewFolderProps extends MenuOptionProp {
    className?: string;
}

export function NewFolder ({ className, disabled, mode, onClick }: NewFolderProps) {
    const { t } = useTranslation('translation');
    const selectedHost = sftpStore.getHostInMode(mode);

    const onClickNewFolderHandler = () => {
        if (disabled) { return; }

        if (selectedHost?.sftpFileList) {
            selectedHost.modalOption.newFolderState = true;
        }

        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.newFolder, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickNewFolderHandler}
        >
            {t('Новая папка')}
        </Button>
    );
}
