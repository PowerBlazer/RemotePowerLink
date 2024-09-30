import {classNames} from 'shared/lib/classNames/classNames';
import style from './ErrorPage.module.scss';
import {useTranslation} from 'react-i18next';
import {Button, ThemeButton} from 'shared/ui/Button/Button';
import {useTheme} from "shared/lib/Theme/useTheme";
import PageErrorImage from 'shared/assets/imgs/page_error.jpg';

interface ErroPagerProps {
    className?: string;
    error?: string
}

export function ErrorPage ({ className, error }: ErroPagerProps) {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const reloadPage = () => {
        location.reload();
    }

    return (
        <div className={classNames(style.pageError, {}, [className])}>
            <img src={PageErrorImage} width={521} height={314} alt={'error_img'}/>
            <div className={classNames(style.error_message)}>
                {error ? t(error) : 'Произошла ошибка'}
            </div>
            <Button 
                className={classNames(style.reload_page)} 
                onClick={reloadPage} 
                theme={ThemeButton.PRIMARY}
            >
                {t('Обновить страницу')}
            </Button>
        </div>
    );
}
