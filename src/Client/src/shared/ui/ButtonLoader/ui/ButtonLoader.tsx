import { classNames } from 'shared/lib/classNames/classNames';
import {Button, ThemeButton} from 'shared/ui/Button/Button';
import { ButtonHTMLAttributes, useCallback, useState } from 'react';
import { Loader } from 'shared/ui/Loader/Loader';
import style from './ButtonLoader.module.scss';


interface ButtonLoaderProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    actionAsync?: () => Promise<void>;
    theme?: ThemeButton
}

export function ButtonLoader (props: ButtonLoaderProps) {
    const {
        className,
        children,
        actionAsync,
        theme,
        ...otherProps
    } = props;

    const [loading, setLoading] = useState<boolean>(false);

    const clickEventHandler = useCallback(async () => {
        if (actionAsync) {
            setLoading(true);
            await actionAsync();
            setLoading(false);
        }
    }, [actionAsync])

    return (
        <Button
            className={classNames(style.buttonLoader, {}, [className, style[theme]])}
            onClick={clickEventHandler}
            theme={theme}
            {...otherProps}
        >
            {loading && <Loader className={style.loader}/>}
            {!loading && children}
        </Button>
    );
}
