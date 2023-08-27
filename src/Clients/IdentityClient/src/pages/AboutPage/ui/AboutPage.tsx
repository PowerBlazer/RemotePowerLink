import { useTranslation } from 'react-i18next';

export default function AboutPage () {
    const { t } = useTranslation('about');

    return (
        <h1>{t('О сайте')}</h1>
    )
}
