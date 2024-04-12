import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpMenuOptions.module.scss';
import { MenuOptionProp } from 'features/SftpMenuOptions';
import { Button } from 'shared/ui/Button/Button';

interface UnloadProps extends MenuOptionProp {
    className?: string;
}

export function Unload ({ className, disabled, mode, onClick }: UnloadProps) {
    const onClickUnloadHandler = () => {
        if (disabled) { return; }

        if (onClick) {
            onClick();
        }
    }

    return (
        <Button
            className={classNames(style.unload, { [style.disabled]: disabled }, [className, style.menu_item])}
            onClick={onClickUnloadHandler}
        >
            Unload
        </Button>
    );
}
