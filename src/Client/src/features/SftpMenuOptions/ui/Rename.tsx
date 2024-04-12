import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';

interface RenameProps extends MenuOptionProp {
    className?: string;
}

export function Rename ({ className, disabled, mode, onClick }: RenameProps) {
    const onClickRenameHandler = () => {
        if (disabled) { return; }

        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.rename, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickRenameHandler}
        >
            Rename
        </Button>
    );
}
