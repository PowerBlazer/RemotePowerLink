import { ThemeSwitcher } from 'features/ThemeSwitcher';
import { useTranslation } from 'react-i18next';
import { LangSwitcher } from 'features/LangSwitcher';

export default function MainPage () {
    const { t } = useTranslation();

    return (
        <div>
            {t('Главная страница')}
          
        </div>
    );
}
