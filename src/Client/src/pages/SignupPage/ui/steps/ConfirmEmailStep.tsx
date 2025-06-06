import { classNames } from 'shared/lib/classNames/classNames';
import { useTranslation } from 'react-i18next';
import { ButtonLoader } from 'shared/ui/ButtonLoader';
import { useContext, useState } from 'react';
import { RegistrationContext, RegistrationSteps } from 'app/providers/RegistrationProvider';
import { ErrorLabel } from 'shared/ui/ErrorLabel';
import { AuthorizationService } from 'app/services/AuthorizationService/authorizationService';
import { Button } from 'shared/ui/Button/Button';
import { useTimer } from 'react-timer-and-stopwatch';
import style from 'pages/SignupPage/ui/Signup.module.scss';
import { VerificationService } from 'app/services/VerificationService/verificationService';

export function ConfirmEmailStep () {
    const { t } = useTranslation('authorization');
    const { stepModel, setStepRegistration } = useContext(RegistrationContext);

    const [verificationCode, setVerificationCode] = useState('');
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isResend, setResendValue] = useState<boolean>(false);

    const timer = useTimer({
        create: {
            timerWithDuration: {
                time: {
                    minutes: 1,
                    seconds: 30
                }
            }
        },
        callbacks: {
            onFinish: () => { setResendValue(true); }
        },
        textOutputWithWords: true
    })

    const { timerText, resetTimer } = timer;

    const resendEmailVerification = async () => {
        if (isResend) {
            const result = await VerificationService.resendCodeToConfirmEmail({
                email: stepModel.email,
                sessionId: AuthorizationService.getSessionId()
            })

            if (result.isSuccess) {
                resetTimer();
                setResendValue(false);
            }
        }
    }

    const confirmEmailHandler = async () => {
        const confirmEmailModel = {
            sessionId: AuthorizationService.getSessionId(),
            verificationCode
        }

        const result = await VerificationService.verifyCodeToConfirmEmail(confirmEmailModel);

        if (result.isSuccess) {
            setStepRegistration({
                step: RegistrationSteps.Registration
            });
            return;
        }

        setErrors(result.errors);
    }

    return (
        <>
            <h2 className={classNames(style.header)}>{t('Подвердите код верификации')}</h2>
            <input
                type="text"
                className={classNames(style.code_vericifaction, {
                    [style.error]: errors?.VerificationCode !== undefined,
                    [style.error]: errors?.Session !== undefined
                })}
                placeholder={t('Код верификации')}
                onChange={(e) => {
                    setVerificationCode(e.target.value);
                    setErrors({});
                }}
            />
            {errors?.VerificationCode && <ErrorLabel errors={ errors.VerificationCode }/>}
            {errors?.Session && <ErrorLabel errors={ errors.Session }/>}

            <ButtonLoader
                type="button"
                className={classNames(style.continue)}
                actionAsync={confirmEmailHandler}
            >
                {t('Продолжить')}
            </ButtonLoader>

            <Button
                className={classNames(style.timer, {
                    [style.time_disabled]: !isResend
                }, [])}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={resendEmailVerification}
            >
                {isResend ? t('Повтороно отправить на почту') : `${t('Повтороно отправить на почту через')} ${timerText}`}
            </Button>
        </>
    );
}
