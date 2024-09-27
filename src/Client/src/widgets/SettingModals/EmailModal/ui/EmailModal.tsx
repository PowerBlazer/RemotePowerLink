import { classNames } from 'shared/lib/classNames/classNames';
import style from './EmailModal.module.scss';
import { observer } from 'mobx-react-lite';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTimer } from 'react-timer-and-stopwatch';
import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import userStore from 'app/store/userStore';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import { Input } from 'shared/ui/Input';
import { ErrorList } from 'shared/ui/ErrorList';
import { Button } from 'shared/ui/Button/Button';
import { VerificationService } from 'app/services/VerificationService/verificationService';
import { VerifyCodeToChangeEmailData, VerifyCodeToConfirmNewEmailData } from 'app/services/VerificationService/config';
import { UserService } from 'app/services/UserService/userService';
import toast from 'react-hot-toast';

interface EmailModalProps {
    className?: string;
}

enum StepUpdateEmail {
    VerificationChange,
    ConfirmNewEmail
}

function EmailModal ({ className }: EmailModalProps) {
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [step, setStep] = useState<StepUpdateEmail>(StepUpdateEmail.VerificationChange);

    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isResend, setResendValue] = useState<boolean>(false);

    const { t } = useTranslation('translation');
    const location = useNavigate();
    const { theme } = useTheme();

    const [
        verifyCodeToChangeEmailData,
        setVerifyCodeToChangeEmailData
    ] = useState<VerifyCodeToChangeEmailData>({ sessionId: '', verificationCode: '' });

    const [
        verifyCodeToConfirmNewEmailData,
        setVerifyCodeToConfirmNewEmailData
    ] = useState<VerifyCodeToConfirmNewEmailData>({ sessionId: '', verificationCode: '' })

    const [newEmail, setNewEmail] = useState<string>('');

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

    const isSessionChangeEmailNull = verifyCodeToChangeEmailData.sessionId.length === 0;
    const isSessionConfirmNewEmailNull = verifyCodeToConfirmNewEmailData.sessionId.length === 0;

    const sendCodeToChangeEmail = async () => {
        const sendResult = await VerificationService.sendCodeToChangeEmail();

        if (sendResult.isSuccess) {
            setVerifyCodeToChangeEmailData({
                ...verifyCodeToChangeEmailData,
                sessionId: sendResult.result.sessionId
            });

            resetTimer();

            setResendValue(false);
        } else {
            setErrors(sendResult.errors);
        }
    }

    const resendCodeToChangeEmail = async () => {
        const sendResult = await VerificationService.resendCodeToChangeEmail({
            sessionId: verifyCodeToChangeEmailData.sessionId
        });

        if (sendResult.isSuccess) {
            setVerifyCodeToChangeEmailData({
                ...verifyCodeToChangeEmailData,
                sessionId: sendResult.result.sessionId
            });

            resetTimer();

            setResendValue(false);
        } else {
            setErrors(sendResult.errors);
        }
    }

    const verifyCodeToChangeEmail = async () => {
        const verifyResult = await VerificationService
            .verifyCodeToChangeEmail({
                ...verifyCodeToChangeEmailData,
                verificationCode
            });

        if (verifyResult.isSuccess) {
            setStep(StepUpdateEmail.ConfirmNewEmail);
            setVerificationCode('');
            setErrors({});
            setResendValue(false)
        } else {
            setErrors(verifyResult.errors)
        }
    }

    const sendCodeToConfirmNewEmail = async () => {
        const sendResult = await VerificationService.sendCodeToConfirmNewEmail({
            newEmail,
            sessionId: verifyCodeToChangeEmailData.sessionId

        });

        if (sendResult.isSuccess) {
            setVerifyCodeToConfirmNewEmailData({
                ...verifyCodeToConfirmNewEmailData,
                sessionId: sendResult.result.sessionId
            });

            resetTimer();

            setResendValue(false);
        } else {
            setErrors(sendResult.errors);
        }
    }

    const resendCodeToConfirmNewEmail = async () => {
        const resendResult = await VerificationService.resendCodeToConfirmNewEmail({
            sessionId: verifyCodeToConfirmNewEmailData.sessionId
        });

        if (resendResult.isSuccess) {
            setVerifyCodeToChangeEmailData({
                ...verifyCodeToConfirmNewEmailData,
                sessionId: resendResult.result.sessionId
            });

            resetTimer();

            setResendValue(false);
        } else {
            setErrors(resendResult.errors);
        }
    }

    const verifyCodeToConfirmNewEmail = async () => {
        const verifyResult = await VerificationService.verifyCodeToConfirmNewEmail({
            ...verifyCodeToConfirmNewEmailData,
            verificationCode
        });

        if (verifyResult.isSuccess) {
            const updateEmailResult = await UserService.updateEmail({
                sessionId: verifyCodeToConfirmNewEmailData.sessionId
            })

            if (updateEmailResult.isSuccess) {
                userStore.settingsModalOptions.emailState = false;

                await delay(500);

                toast.success(t('Email успешно обновлен'));

                userStore.isLoadData = true;

                const refreshedUserData = await UserService.getUserData();

                if (refreshedUserData.isSuccess) {
                    userStore.setUserData(refreshedUserData.result);

                    userStore.isLoadData = false
                }
            } else {
                setErrors(updateEmailResult.errors)
            }
        } else {
            setErrors(verifyResult.errors);
        }
    }

    const onChangeVerificationCode = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors({});
        setVerificationCode(e.target.value);
    }

    const onChangeNewEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors({});
        setNewEmail(e.target.value);
    }

    const changeEmailStep = useMemo(() => {
        return (
            <div className={classNames(style.changeEmailStep)}>
                <div className={classNames(style.verification)}>
                    <div className={classNames(style.label)}>{t('Введите код подтверждения')}</div>
                    <Input
                        value={verificationCode}
                        className={classNames(style.session_confirm_input)}
                        placeholder={t('Код подтверждения')}
                        onChange={onChangeVerificationCode}
                        errors={errors.VerificationCode}
                    />
                </div>
                <ErrorList errors={errors} keyIgnoreList={['VerificationCode']}/>
                <Button
                    className={classNames(style.send_verification_code, {
                        [style.resend_disabled]: !isResend && !isSessionChangeEmailNull
                    })}
                    onClick={async () => {
                        if (isSessionChangeEmailNull) {
                            await sendCodeToChangeEmail()
                        } else if (isResend) { await resendCodeToChangeEmail() }
                    }}
                >
                    {isSessionChangeEmailNull && t('Отправить код потдверждения на почту')}
                    {!isSessionChangeEmailNull
                        ? isResend
                            ? t('Повторно отправить код потдверждения на почту')
                            : `${t('Повторно отправить через')} ${timerText}`
                        : ''
                    }
                </Button>
            </div>
        )
    }, [
        verificationCode,
        errors,
        timerText,
        isSessionChangeEmailNull,
        isResend
    ]
    )

    const confirmNewEmailStep = useMemo(() => {
        return (
            <div className={classNames(style.changeEmailStep)}>
                <div className={classNames(style.new_email)}>
                    <div className={classNames(style.label)}>{t('Введите новый почтовый ящик')}</div>
                    <Input
                        value={newEmail}
                        className={classNames(style.new_email_input)}
                        placeholder={t('Новый email')}
                        onChange={onChangeNewEmail}
                        errors={errors.Email}
                    />
                </div>
                <div className={classNames(style.verification)}>
                    <div className={classNames(style.label)}>{t('Введите код подтверждения')}</div>
                    <Input
                        value={verificationCode}
                        className={classNames(style.session_confirm_input)}
                        placeholder={t('Код подтверждения')}
                        onChange={onChangeVerificationCode}
                        errors={errors.VerificationCode}
                    />
                </div>
                <ErrorList errors={errors} keyIgnoreList={['Email', 'VerificationCode']}/>
                <Button
                    className={classNames(style.send_verification_code, {
                        [style.resend_disabled]: !isResend && !isSessionConfirmNewEmailNull
                    })}

                    onClick={async () => {
                        if (isSessionConfirmNewEmailNull) {
                            await sendCodeToConfirmNewEmail()
                        } else if (isResend) { await resendCodeToConfirmNewEmail() }
                    }}
                >
                    {isSessionConfirmNewEmailNull && t('Отправить код потдверждения на новую почту')}
                    {!isSessionConfirmNewEmailNull
                        ? isResend
                            ? t('Повторно отправить код потдверждения на новую почту')
                            : `${t('Повторно отправить через')} ${timerText}`
                        : ''
                    }
                </Button>
            </div>
        )
    }, [verificationCode,
        timerText,
        errors,
        newEmail,
        isSessionConfirmNewEmailNull,
        isResend])

    return (
        <Modal
            options={{
                type: TypeModal.FORM,
                onCancel: () => {
                    userStore.settingsModalOptions.emailState = false;
                },
                onConfirm: step === StepUpdateEmail.VerificationChange
                    ? verifyCodeToChangeEmail
                    : verifyCodeToConfirmNewEmail,
                disabled: errors && Object.keys(errors).length > 0,
                isCloseConfirm: false,
                headerName: t('Смена почтового ящика')
            }}
            className={classNames(style.password_modal, {}, [className])}
            theme={theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK}
            isVisible={userStore.settingsModalOptions.emailState}
        >
            {step === StepUpdateEmail.VerificationChange ? changeEmailStep : confirmNewEmailStep}
        </Modal>
    );
}

export default observer(EmailModal)
