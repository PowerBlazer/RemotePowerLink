import { classNames } from 'shared/lib/classNames/classNames';
import style from './UsernameModal.module.scss';
import { Modal, ThemeModal, TypeModal } from 'shared/ui/Modal';
import { useTheme } from 'shared/lib/Theme/useTheme';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import userStore from 'app/store/userStore';
import { Theme } from 'shared/lib/Theme/ThemeContext';
import { Input } from 'shared/ui/Input';
import { ErrorList } from 'shared/ui/ErrorList';
import { UpdateUserData } from 'app/services/UserService/config';
import { UserService } from 'app/services/UserService/userService';
import toast from 'react-hot-toast';

interface UsernameModalProps {
    className?: string;
}

function UsernameModal ({ className }: UsernameModalProps) {
    const { theme } = useTheme();
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const { t } = useTranslation('translation');
    const [username, setUsername] = useState<string>(userStore.userData?.username);

    const changeUsernameHandler = async () => {
        const updateUserData: UpdateUserData = {
            username,
            phoneNumber: userStore.userData.phoneNumber
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

    const onChangeUsernameHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors({});
        setUsername(e.target.value)
    }

    return (
        <Modal
            options={{
                type: TypeModal.FORM,
                onCancel: () => {
                    userStore.settingsModalOptions.usernameState = false;
                },
                onConfirm: changeUsernameHandler,
                disabled: errors && Object.keys(errors).length > 0,
                isCloseConfirm: false,
                headerName: t('Смена никнейма')
            }}
            theme={theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK}
            isVisible={userStore.settingsModalOptions.usernameState}
            className={classNames(style.usernameModal, {}, [className])}
        >
            <div className={classNames(style.username_input)}>
                <div className={classNames(style.label)}>{t('Введите никнейм')}</div>

                <Input
                    value={username}
                    className={classNames(style.previousPassword)}
                    placeholder={t('Никнейм')}
                    onChange={onChangeUsernameHandler}
                    errors={errors?.Username}
                />
            </div>
            <ErrorList errors={errors} keyIgnoreList={['Username']}/>
        </Modal>
    );
}

export default observer(UsernameModal)
