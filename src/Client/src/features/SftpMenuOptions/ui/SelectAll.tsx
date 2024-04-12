import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';
import sftpStore from 'app/store/sftpStore';

interface SelectAllProps extends MenuOptionProp {
    className?: string;
}

export function SelectAll ({ className, disabled, mode, onClick }: SelectAllProps) {
    const onClickSelectAllHandler = () => {
        if (disabled) { return; }

        sftpStore.setSelectAllInFilter(mode);

        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.selectAll, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickSelectAllHandler}
        >
            Select All
        </Button>
    );
}
