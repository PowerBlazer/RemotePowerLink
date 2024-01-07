import { useTranslation } from 'react-i18next';
import { classNames } from "shared/lib/classNames/classNames";
import { Logotype } from 'features/Logotype';
import style from "./Login.module.scss";
import { Link } from "react-router-dom";


export default function LoginPage () {
    const { t } = useTranslation('login');

    return (
        <div className={classNames(style.login_page)}>
            <Logotype fontSize={28}/>
           
            <div className={classNames(style.login_form)}>
                <h2 className={classNames(style.header)}>{t("Войдите в свою учетную запись")}</h2>
                <div className={classNames(style.form_inner)}>
                    <input type="email" className={classNames(style.email_input)} placeholder={t("Почта")}/>
                    <input type="password" className={classNames(style.password_input)} placeholder={t("Пароль")}/>
                    <button type="button" className={classNames(style.continue)}>{t("Продолжить")}</button>
                </div>
                
            </div>
            <p className={classNames(style.signup)}>
                {t("У вас нет аккаунта? ")}
                <Link to="/" className={classNames(style.signup_link)}>{t("Регистрация")}</Link>
            </p>
        </div>
    )
}
