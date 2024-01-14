import { classNames } from 'shared/lib/classNames/classNames';
import {useTranslation} from "react-i18next";
import InfoIcon from 'shared/assets/icons/info.svg';
import style from "pages/SignupPage/ui/Signup.module.scss";


export function ConfirmEmailStep () {
    const { t } = useTranslation("authorization");
    
    return (
        <>
            <h2 className={classNames(style.header)}>{t('Подвердите код верификации')}</h2>
            <input
                type="text"
                className={classNames(style.code_vericifaction, {
                   
                })}
                placeholder={t('Код верификации')}
                onChange={(e) => {
                   
                }}
            />
        </>
    );
}