import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';

interface DeleteProps extends MenuOptionProp {
    className?: string;
}

export function Delete ({ className, disabled, mode, onClick }: DeleteProps) {
    const { t } = useTranslation('translation')
    const onClickDeleteHandler = () => {
        if (disabled) { return; }

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
