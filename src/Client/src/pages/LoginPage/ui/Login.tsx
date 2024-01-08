import { useTranslation } from 'react-i18next';
import { classNames } from "shared/lib/classNames/classNames";
import { Logotype } from 'features/Logotype';
import {Link, useNavigate} from "react-router-dom";
import style from "./Login.module.scss";
import { ButtonLoader } from "features/ButtonLoader";
import {AuthorizationService} from "services/authorizationService";
import { useState } from "react";

export default function LoginPage () {
    const { t } = useTranslation('login');
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const loginClickHandler = async ()=>{
        const loginModel = {
            email:email,
            password:password
        }
        
        const resultLogin = await AuthorizationService.login(loginModel);
        
        if(resultLogin.isSuccess){
            navigate("/");
            return;
        }
        
        
    };

    return (
        <div className={classNames(style.login_page)}>
            <Logotype fontSize={28}/>
           
            <div className={classNames(style.login_form)}>
                <h2 className={classNames(style.header)}>{t("Войдите в свою учетную запись")}</h2>
                <div className={classNames(style.form_inner)}>
                    <input 
                        type="email" 
                        className={classNames(style.email_input)} 
                        placeholder={t("Почта")}
                        onChange={(e)=> setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        className={classNames(style.password_input)} 
                        placeholder={t("Пароль")}
                        onChange={(e)=> setPassword(e.target.value)}
                    />
                    <ButtonLoader 
                        type="button" 
                        className={classNames(style.continue)}
                        actionAsync={loginClickHandler}
                    >
                        {t("Продолжить")}
                    </ButtonLoader>
                </div>
                <p className={classNames(style.recover_password)}>
                    <Link to="/">{t("Забыли пароль?")}</Link>
                </p>
            </div>
            <p className={classNames(style.signup)}>
                {t("У вас нет аккаунта?")}
                <Link to="/" className={classNames(style.signup_link)}>{t("Регистрация")}</Link>
            </p>
        </div>
    )
}
