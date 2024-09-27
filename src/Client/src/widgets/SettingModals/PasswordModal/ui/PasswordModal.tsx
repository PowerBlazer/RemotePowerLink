import { observer } from 'mobx-react-lite';
import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import userStore from 'app/store/userStore';
import { ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from 'shared/lib/classNames/classNames';
import style from './PasswordModal.module.scss';
import { Input } from 'shared/ui/Input';
import { ChangePasswordData } from 'app/services/UserService/config';
import { UserService } from 'app/services/UserService/userService';
import toast from 'react-hot-toast';
import InfoIcon from 'shared/assets/icons/info.svg';
import { useTimer } from 'react-timer-and-stopwatch';
import { Button } from 'shared/ui/Button/Button';
import { ErrorList } from 'shared/ui/ErrorList';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from 'app/providers/router/config/routeConfig';
import { VerificationService } from 'app/services/VerificationService/verificationService';

interface PasswordModalProps {
    className?: string;
}

function PasswordModal ({ className }: PasswordModalProps) {
    const { theme } = useTheme();
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const { t } = useTranslation('translation');
    const [sessionState, setSessionState] = useState<boolean>(false);
    const location = useNavigate();

    const [
        changePasswordData,
        setChangePasswordData
    ] = useState<ChangePasswordData>({ previousPassword: '', newPassword: '', sessionId: '' });

    const [verificationCode, setVerificationCode] = useState<string>('');
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
    const isSessionNull = changePasswordData.sessionId.length === 0;

    const changePasswordHandler = async () => {
        const changePasswordResult = await UserService.changePassword(changePasswordData);

        if (changePasswordResult.isSuccess) {
            userStore.settingsModalOptions.passwordState = false;

            toast.success(t('Пароль успешно изменен'));

            await delay(1000);

            location(`/${AppRoutes.LOGIN}`)
        }

        if (!changePasswordResult.isSuccess) {
            setErrors(changePasswordResult.errors);
        }
    }

    const sendCodeResetPasswordHandler = async () => {
        const codeResult = await VerificationService.sendCodeToUpdatePassword();

        if (codeResult.isSuccess) {
            setChangePasswordData({
                ...changePasswordData,
                sessionId: codeResult.result.sessionId
            });

            resetTimer();
            setResendValue(false);
        }

        if (!codeResult.isSuccess) {
            setErrors(codeResult.errors);
        }
    }
    const resendCodeResetPasswordHandler = async () => {
        if (isResend) {
            const codeResult = await VerificationService.resendCodeToUpdatePassword({
                sessionId: changePasswordData.sessionId
            });

            if (codeResult.isSuccess) {
                setChangePasswordData({
                    ...changePasswordData,
                    sessionId: codeResult.result.sessionId
                })

                resetTimer();
                setResendValue(false);
            }

            if (!codeResult.isSuccess) {
                setErrors(codeResult.errors);
            }
        }
    }

    const confirmSessionHandler = async () => {
        const verifyResult = await VerificationService.verifyCodeToUpdatePassword({
            sessionId: changePasswordData.sessionId,
            verificationCode
        });

        if (verifyResult.isSuccess) {
            setSessionState(true)
        }

        if (!verifyResult.isSuccess) {
            setErrors(verifyResult.errors);
        }
    }

    const onChangePreviousPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors({});

        setChangePasswordData({
            ...changePasswordData,
            previousPassword: e.target.value
        })
    }

    const onChangeVerificationCode = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors({});
        setVerificationCode(e.target.value);
    }

    const onChangeNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors({});

        setChangePasswordData({
            ...changePasswordData,
            newPassword: e.target.value
        })
    }

    const sessionConfirmPanel = useMemo(() => {
        return (
            <div className={classNames(style.session_confirm_panel)}>
                <div className={classNames(style.session_confirm_inner)}>
                    <div className={classNames(style.label)}>{t('Введите код подтверждения')}</div>
                    <Input
                        value={verificationCode}
                        className={classNames(style.session_confirm_input)}
                        placeholder={t('Код подтверждения')}
                        onChange={onChangeVerificationCode}
                    />
                </div>
                <ErrorList errors={errors}/>
                <Button
                    className={classNames(style.send_verification_code, {
                        [style.resend_disabled]: !isResend && !isSessionNull
                    })}
                    onClick={async () => {
                        if (isSessionNull) {
                            await sendCodeResetPasswordHandler()
                        } else if (isResend) { await resendCodeResetPasswordHandler() }
                    }}
                >
                    {isSessionNull && t('Отправить код потдверждения на почту')}
                    {!isSessionNull
                        ? isResend
                            ? t('Повторно отправить на почту')
                            : `${t('Повторно отправить на почту через')} ${timerText}`
                        : ''
                    }
                </Button>
            </div>
        )
    }, [
        verificationCode,
        timerText,
        isSessionNull,
        isResend
    ])

    const changePasswordPanel = useMemo(() => {
        return (
            <div className={classNames(style.change_password_panel)}>
                <div className={classNames(style.password_input)}>
                    <div className={classNames(style.label)}>{t('Введите старый пароль')}</div>
                    <Input
                        value={changePasswordData.previousPassword}
                        className={classNames(style.previousPassword)}
                        placeholder={t('Предыдущий пароль')}
                        onChange={onChangePreviousPassword}
                        errors={errors?.PreviousPassword}
                    />
                </div>

                <div className={classNames(style.password_input)}>
                    <div className={classNames(style.label)}>{t('Введите новый пароль')}</div>
                    <Input
                        value={changePasswordData.newPassword}
                        className={classNames(style.newPassword)}
                        placeholder={t('Новый пароль')}
                        onChange={onChangeNewPassword}
                        errors={errors?.NewPassword}
                    />
                </div>
                <ErrorList errors={errors} keyIgnoreList={['NewPassword', 'PreviousPassword']}/>
                <div className={classNames(style.info_block)}>
                    <InfoIcon/>
                    <p>{t('Смена пароля аккаунта, произведет к выходу из системы со всех устройств')}</p>
                </div>
            </div>
        )
    }, [
        changePasswordData.previousPassword,
        changePasswordData.newPassword,
        errors
    ])

    return (
        <Modal
            options={{
                type: TypeModal.FORM,
                onCancel: () => {
                    userStore.settingsModalOptions.passwordState = false;
                },
                onConfirm: sessionState ? changePasswordHandler : confirmSessionHandler,
                disabled: errors && Object.keys(errors).length > 0,
                isCloseConfirm: false,
                headerName: t('Смена пароля')
            }}
            className={classNames(style.password_modal, {}, [className])}
            theme={theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK}
            isVisible={userStore.settingsModalOptions.passwordState}
        >
            { sessionState ? changePasswordPanel : sessionConfirmPanel }
        </Modal>

    );
}

export default observer(PasswordModal)
