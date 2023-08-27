import { classNames } from 'shared/lib/classNames/classNames';
import style from './PageLoader.module.scss';
import { Loader } from 'shared/ui/Loader/Loader';

interface PageLoaderProps {
    className?: string;
}

export function PageLoader ({ className }: PageLoaderProps) {
    return (
        <div className={classNames(style.pageLoader, {}, [className])}>
            <Loader/>
        </div>
    );
}
