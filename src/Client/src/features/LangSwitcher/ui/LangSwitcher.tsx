import { useTranslation } from 'react-i18next';
import { classNames } from 'shared/lib/classNames/classNames';
import style from './LangSwitcher.module.scss';

interface LangSwitcherProps {
    className?: string
}

export function LangSwitcher ({ className }: LangSwitcherProps) {
    const { t, i18n } = useTranslation();

    const toggle = () => {
        i18n.changeLanguage(i18n.language === 'ru' ? 'en' : 'ru');
    }

    return (
        <label className={classNames(style.toggler_wrapper)}>
            <input
                type="checkbox"
                checked={i18n.language === 'ru'}
                onChange={toggle}
            />
            <div className={classNames(style.toggler_slider)} data-lang={i18n.language.toUpperCase()}>
                <div className={classNames(style.toggler_knob)}></div>
            </div>
        </label>
        // <Button
        //     className={classNames(style.langSwitcher, {}, [className])}
        //     theme={ThemeButton.CLEAR}
        //     onClick={toggle}
        // >
        //     {t('Язык')}
        // </Button>
    )
}
