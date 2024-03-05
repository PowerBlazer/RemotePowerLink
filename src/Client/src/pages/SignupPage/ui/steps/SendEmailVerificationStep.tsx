import { classNames } from 'shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import { ButtonLoader } from 'shared/ui/ButtonLoader';
import { useContext, useState } from 'react';
import { RegistrationContext, RegistrationSteps } from 'app/providers/RegistrationProvider';
import { SendEmailVerificationModel } from 'app/services/AuthorizationService/configs/signupConfig';
import { AuthorizationService } from 'app/services/AuthorizationService/authorizationService';
import { ErrorLabel } from 'shared/ui/ErrorLabel';
import style from 'pages/SignupPage/ui/Signup.module.scss';

export function SendEmailVerificationStep () {
    const { t } = useTranslation('authorization');
    const { stepModel, setStepRegistration } = useContext(RegistrationContext);

    const [email, setEmail] = useState(stepModel.email);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const sendEmailVerificationHandler = async () => {
        const sendEmailModel: SendEmailVerificationModel = {
            email
        };

        const result = await AuthorizationService.sendEmailVerification(sendEmailModel);

        if (result.isSuccess) {
            setStepRegistration({
                step: RegistrationSteps.ConfirmEmail,
                email
            });

            return;
        }

        setErrors(result.errors);
    }

    return (
        <>
            <h2 className={classNames(style.header)}>{t('Создать учетную запись')}</h2>
            <div className={classNames(style.form_inner)}>
                <input
                    type="email"
                    className={classNames(style.email_input, {
                        [style.error]: errors?.Email !== undefined
                    })}
                    placeholder={t('Почта')}

                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({});
                    }}
                />
                {errors?.Email && <ErrorLabel errors={ errors.Email }/>}

                <ButtonLoader
                    type="button"
                    className={classNames(style.continue)}
                    actionAsync={sendEmailVerificationHandler}
                >
                    {t('Продолжить')}
                </ButtonLoader>
            </div>
        </>
    );
}
