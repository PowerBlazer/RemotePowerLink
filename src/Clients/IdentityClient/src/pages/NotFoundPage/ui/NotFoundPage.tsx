import { classNames } from 'shared/lib/classNames/classNames';
import style from './NotFoundPage.module.scss';
import { useTranslation } from 'react-i18next';

interface NotFoundPageProps {
    className?: string;
}

export function NotFoundPage ({ className }: NotFoundPageProps) {
    const { t } = useTranslation();

    return (
        <div className={classNames(style.notFoundPage, {}, [className])}>
            {t('Страница не найдена')}
        </div>
    );
}
