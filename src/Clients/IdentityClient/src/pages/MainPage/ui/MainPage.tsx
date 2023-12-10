import { ThemeSwitcher } from 'features/ThemeSwitcher';
import { useTranslation } from 'react-i18next';
import { LangSwitcher } from 'widgets/LangSwitcher';

function MainPage () {
    const { t } = useTranslation();

    return (
        <div>
            {t('Главная страница')}
            <LangSwitcher/>
            <ThemeSwitcher></ThemeSwitcher>
        </div>
    );
}

export default MainPage;
