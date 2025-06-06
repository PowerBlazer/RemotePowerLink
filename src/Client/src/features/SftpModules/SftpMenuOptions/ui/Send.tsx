import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpModules/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import sftpStore from 'app/store/sftpStore';
import { useTranslation } from 'react-i18next';
import useSftp from 'app/hooks/useSftp';

interface SendProps extends MenuOptionProp {
    className?: string;
}

export function Send ({ className, disabled, windowsIndex, onClick }: SendProps) {
    const { t } = useTranslation('translation');
    const { getHost } = useSftp(windowsIndex);

    const selectedHost = getHost();

    const onClickSendHandler = () => {
        if (disabled) { return; }

        if (selectedHost?.sftpFileList) {
            selectedHost.modalOption.sendState = true;
        }

        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.send, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickSendHandler}
        >
            {t('Отправить')}
        </Button>
    );
}
