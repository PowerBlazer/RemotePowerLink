import { classNames } from 'shared/lib/classNames/classNames';
import style from './SelectHostBlock.module.scss';
import LogoIcon from 'shared/assets/icons/logo.svg';
import { Button, ThemeButton } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';

interface SelectHostBlockProps {
    className?: string;
    onClick: () => void
}

export function SelectHostBlock ({ className, onClick }: SelectHostBlockProps) {
    const { t } = useTranslation('translation');

    return (
        <div className={classNames(style.host_information_block, {}, [className])}>
            <LogoIcon width={180} height={156}/>
            <div className={classNames(style.information_content)}>
                <div className={classNames(style.header_information)}>
                    <h1>{t('Подключиться к серверу')}</h1>
                    <h3>{t('Выберите из вашего сохраненного сервера')}</h3>
                </div>
                <Button
                    className={classNames(style.select_server)}
                    theme={ThemeButton.PRIMARY}
                    onClick={onClick}
                >
                    {t('Выбрать сервер')}
                </Button>
            </div>
        </div>
    );
}
