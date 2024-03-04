import { classNames } from 'shared/lib/classNames/classNames';
import style from './ButtonEdit.module.scss';
import {Button} from "shared/ui/Button/Button";

interface ButtonEditProps {
    className?: string;
}

export function ButtonEdit ({ className }: ButtonEditProps) {
    return (
        <Button className={classNames(style.ButtonEdit, {}, [className])}>
        
		</Button>
    );
}