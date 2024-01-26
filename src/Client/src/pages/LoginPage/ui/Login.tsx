import { useTranslation } from 'react-i18next';
import { classNames } from 'shared/lib/classNames/classNames';
import { Logotype } from 'features/Logotype';
import { Link, useNavigate } from 'react-router-dom';
import { ButtonLoader } from 'shared/ui/ButtonLoader';
import { AuthorizationService } from 'services/authorizationService/authorizationService';
import { useState } from 'react';
import { ErrorLabel } from 'shared/ui/ErrorLabel';
import style from './Login.module.scss';
import { NavbarBasic } from 'widgets/NavbarBasic';

export default function LoginPage () {
    const { t } = useTranslation('authorization');
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const loginClickHandler = async () => {
        const loginModel = {
            email,
            password
        }

        const resultLogin = await AuthorizationService.login(loginModel);

        if (resultLogin.isSuccess) {
            navigate('/');
            return;
        }
        setErrors(resultLogin.errors);
    };

    return (
        <div className={classNames(style.login_page)}>
            <Logotype fontSize={28}/>
            <div className={classNames(style.login_form)}>
                <h2 className={classNames(style.header)}>{t('Войдите в свою учетную запись')}</h2>
                <div className={classNames(style.form_inner)}>
                    <input
                        type="email"
                        className={classNames(style.email_input, {
                            [style.error]: errors && errors.Email !== undefined
                        })}
                        placeholder={t('Почта')}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors({});
                        }}
                    />
                    {errors && errors.Email && <ErrorLabel errors={errors.Email}/>}
                    <input
                        type="password"
                        className={classNames(style.password_input, {
                            [style.error]: errors && errors.Password !== undefined
                        })}
                        placeholder={t('Пароль')}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors({});
                        }}
                    />
                    {errors && errors.Password && <ErrorLabel errors={errors.Password}/>}
                    <ButtonLoader
                        type="button"
                        className={classNames(style.continue)}
                        actionAsync={loginClickHandler}
                    >
                        {t('Продолжить')}
                    </ButtonLoader>
                </div>
                <p className={classNames(style.recover_password)}>
                    <Link to="/">{t('Забыли пароль?')}</Link>
                </p>
            </div>
            <p className={classNames(style.signup)}>
                {t('У вас нет аккаунта?')}
                <Link to="/signup" className={classNames(style.signup_link)}>{t('Регистрация')}</Link>
            </p>
        </div>

    )
}
