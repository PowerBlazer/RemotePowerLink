import { classNames } from 'shared/lib/classNames/classNames';
import style from './ButtonDelete.module.scss';
import { Button } from 'shared/ui/Button/Button';
import BasketIcon from 'shared/assets/icons/basket.svg';

interface ButtonDeleteProps {
    className?: string;
}

export function ButtonDelete ({ className }: ButtonDeleteProps) {
    return (
        <Button className={classNames(style.buttonDelete, {}, [className])}>
            <BasketIcon width={20} height={20} fill={'#d04040'}/>
        </Button>
    );
}
