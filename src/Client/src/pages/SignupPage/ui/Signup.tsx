import { classNames } from 'shared/lib/classNames/classNames';
import { useContext } from 'react';
import { Logotype } from 'features/Logotype';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RegistrationContext, RegistrationSteps, StepsElements } from 'app/providers/RegistrationProvider';
import style from './Signup.module.scss';
import { Button } from 'shared/ui/Button/Button';

export default function Signup () {
    const { t } = useTranslation('authorization')
    const { stepModel, setStepRegistration } = useContext(RegistrationContext);

    const backStepHandler = () => {
        if (stepModel.step === RegistrationSteps.ConfirmEmail) {
            setStepRegistration({
                step: RegistrationSteps.SendEmailVerification,
                email: stepModel.email
            });
        }

        if (stepModel.step === RegistrationSteps.Registration) {
            setStepRegistration({
                step: RegistrationSteps.SendEmailVerification,
                email: stepModel.email
            });
        }
    }

    return (
        <div className={classNames(style.signup_page)}>
            <Logotype fontSize={28}/>
            <div className={classNames(style.signup_form)}>
                {stepModel.step !== RegistrationSteps.SendEmailVerification &&
                    <Button className={style.back_step} onClick={backStepHandler}>{t('Назад')}</Button>}
                {StepsElements[stepModel.step]}
                <p className={classNames(style.navigation_login)}>
                    {t('У вас уже есть учетная запись?')}
                    <Link to="/login" className={classNames(style.login_link)}>{t('Войти')}</Link>
                </p>
            </div>
        </div>
    );
}
