import { classNames } from 'shared/lib/classNames/classNames';
import style from './PhoneNumberModal.module.scss';
import { observer } from 'mobx-react-lite';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import userStore from 'app/store/userStore';
import { UpdateUserData } from 'app/services/UserService/config';
import { UserService } from 'app/services/UserService/userService';
import toast from 'react-hot-toast';
import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import { Input } from 'shared/ui/Input';
import { ErrorList } from 'shared/ui/ErrorList';

interface PhoneNumberModalProps {
    className?: string;
}

function PhoneNumberModal ({ className }: PhoneNumberModalProps) {
    const { theme } = useTheme();
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const { t } = useTranslation('translation');
    const [phoneNumber, setPhoneNumber] = useState<string>(userStore.userData?.phoneNumber ?? '');

    const changePhoneNumberHandler = async () => {
        const updateUserData: UpdateUserData = {
            username: userStore.userData.username,
            phoneNumber
        }

        const updateReult = await UserService.updateUserData(updateUserData);

        if (updateReult.isSuccess) {
            userStore.userData = updateReult.result
            userStore.settingsModalOptions.usernameState = false;

            toast.success(t('Данные успешно изменены'));
        }

        if (!updateReult.isSuccess) {
            setErrors(updateReult.errors);
        }
    }

    const onChangePhoneNumberHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors({});
        setPhoneNumber(e.target.value)
    }

    return (
        <Modal
            options={{
                type: TypeModal.FORM,
                onCancel: () => {
                    userStore.settingsModalOptions.phoneNumberState = false;
                },
                onConfirm: changePhoneNumberHandler,
                disabled: errors && Object.keys(errors).length > 0,
                isCloseConfirm: false,
                headerName: t('Изменить номер телефона')
            }}
            theme={theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK}
            isVisible={userStore.settingsModalOptions.phoneNumberState}
            className={classNames(style.phoneNumberModal, {}, [className])}
        >
            <div className={classNames(style.phoneNumber_input)}>
                <div className={classNames(style.label)}>{t('Введите номер телефона')}</div>

                <Input
                    value={phoneNumber}
                    className={classNames(style.phoneNumber)}
                    placeholder={t('Номер телефона')}
                    onChange={onChangePhoneNumberHandler}
                    errors={errors?.PhoneNumber}
                />
            </div>
            <ErrorList errors={errors} keyIgnoreList={['PhoneNumber']}/>
        </Modal>
    );
}

export default observer(PhoneNumberModal);
