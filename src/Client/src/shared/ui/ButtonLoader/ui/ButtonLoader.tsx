import { classNames } from 'shared/lib/classNames/classNames';
import { Button } from 'shared/ui/Button/Button';
import { ButtonHTMLAttributes, useCallback, useState } from 'react';
import { Loader } from 'shared/ui/Loader/Loader';
import style from './ButtonLoader.module.scss';

interface ButtonLoaderProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    actionAsync?: () => Promise<void>;
}

export function ButtonLoader (props: ButtonLoaderProps) {
    const {
        className,
        children,
        actionAsync,
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
            className={classNames(style.buttonLoader, {}, [className])}
            onClick={clickEventHandler}
            {...otherProps}
        >
            {loading && <Loader className={style.loader}/>}
            {!loading && children}
        </Button>
    );
}
