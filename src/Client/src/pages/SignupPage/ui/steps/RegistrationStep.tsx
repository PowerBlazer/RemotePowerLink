import { classNames } from 'shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useState } from 'react';
import { ErrorLabel } from 'shared/ui/ErrorLabel';
import { ButtonLoader } from 'shared/ui/ButtonLoader';
import InfoIcon from 'shared/assets/icons/info.svg';
import style from 'pages/SignupPage/ui/Signup.module.scss';
import { RegistrationModel } from 'app/services/AuthorizationService/configs/signupConfig';
import { AuthorizationService } from 'app/services/AuthorizationService/authorizationService';
import { useNavigate } from 'react-router-dom';

const initialRegistrationModel = {
    sessionId: '',
    userName: '',
    password: '',
    passwordConfirm: ''
};

export function RegistrationStep () {
    const { t } = useTranslation('authorization');
    const navigate = useNavigate();

    const [registrationModel, setRegistrationModel] = useState<RegistrationModel>(initialRegistrationModel);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const registrationHandler = async () => {
        const result = await AuthorizationService.registration({
            ...registrationModel,
            sessionId: AuthorizationService.getSessionId()
        });

        if (result.isSuccess) {
            navigate('/');
            return;
        }

        setErrors(result.errors);
    }

    const handleInputChange = (fieldName: string, e: ChangeEvent<HTMLInputElement>) => {
        setRegistrationModel(model => ({
            ...model,
            [fieldName]: e.target.value
        }));

        setErrors({});
    };

    return (
        <>
            <h2 className={classNames(style.header)}>{t('Придумайте себе имя пользователя и пароль')}</h2>
            <div className={classNames(style.form_inner)}>
                <input
                    type="text"
                    className={classNames(style.userName_input, {
                        [style.error]: errors?.UserName !== undefined
                    })}
                    placeholder={t('Имя пользователя')}
                    onChange={(e) => { handleInputChange('userName', e); } }
                />
                {errors?.UserName && <ErrorLabel errors={ errors.UserName }/>}
                <input
                    type="password"
                    className={classNames(style.password_input, {
                        [style.error]: errors?.Password !== undefined
                    })}
                    placeholder={t('Пароль')}
                    onChange={(e) => { handleInputChange('password', e); } }
                />
                <input
                    type="password"
                    className={classNames(style.password_confirm_input, {
                        [style.error]: errors?.Password !== undefined
                    })}
                    placeholder={t('Повторный пароль')}
                    onChange={(e) => { handleInputChange('passwordConfirm', e); } }
                />
                {errors?.Password && <ErrorLabel errors={ errors.Password }/>}
                {errors?.SessionId && <ErrorLabel errors={ errors.SessionId }/>}
                <div className={classNames(style.info_block)}>
                    <InfoIcon/>
                    <p>{t('PasswordInfo')}</p>
                </div>

                <ButtonLoader
                    type="button"
                    className={classNames(style.continue)}
                    actionAsync={registrationHandler}
                >
                    {t('Зарегестрироваться')}
                </ButtonLoader>
            </div>
        </>
    );
}
