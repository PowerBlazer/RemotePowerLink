import { classNames } from 'shared/lib/classNames/classNames';
import style from './SigninButton.module.scss';

interface SigninButtonProps {
    className?: string;
}

export function SigninButton ({ className }: SigninButtonProps) {
    return (
        <div className={classNames(style.signinButton, {}, [className])}>

        </div>
    );
}
