import {observer} from "mobx-react-lite";
import {Modal, ThemeModal, TypeModal} from "shared/ui/Modal";
import {useTheme} from "shared/lib/Theme/useTheme";
import {Theme} from "shared/lib/Theme/ThemeContext";
import userStore from "app/store/userStore";
import {ChangeEvent, useState} from "react";
import {useTranslation} from "react-i18next";
import {classNames} from "shared/lib/classNames/classNames";
import style from './PasswordModal.module.scss';
import {Input} from "shared/ui/Input";
import {ChangePasswordData} from "app/services/UserService/config/userConfig";
import {UserService} from "app/services/UserService/userService";
import toast from "react-hot-toast";
import InfoIcon from "shared/assets/icons/info.svg";

interface PasswordModalProps {
    className?: string;
}

export function PasswordModal ({ className }: PasswordModalProps) {
    const { theme } = useTheme();
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const { t } = useTranslation('translation');
    
    const [
        changePasswordData, 
        setChangePasswordData
    ] = useState<ChangePasswordData>({ previousPassword: '', newPassword: '' });
    
    const changePasswordHandler = async () => {
        const changePasswordResult = await UserService.changePassword(changePasswordData);
        
        if(changePasswordResult.isSuccess){
            userStore.settingsModalOptions.passwordState = false;
            
            toast.success(t('Пароль успешно изменен'));
        }
        
        if(!changePasswordResult.isSuccess){
            setErrors(changePasswordResult.errors);
        }
    }
    
    const onChangePreviousPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors.PreviousPassword;
            return updatedErrors;
        });
        
        setChangePasswordData({
            ...changePasswordData,
            previousPassword: e.target.value
        })
    }
    
    const onChangeNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors.NewPassword;
            return updatedErrors;
        });

        setChangePasswordData({
            ...changePasswordData,
            newPassword: e.target.value
        })
    }
    
    return (

        <Modal
            options={{
                type: TypeModal.FORM,
                onCancel: () => { userStore.settingsModalOptions.passwordState = false; },
                onConfirm: changePasswordHandler,
                disabled: errors && Object.keys(errors).length > 0,
                isCloseConfirm: false,
                headerName: t('Смена пароля')
            }}
            className={classNames(style.password_modal,{}, [className])}
            theme={ theme === Theme.LIGHT ? ThemeModal.CLEAR : ThemeModal.DARK }
            isVisible={ userStore.settingsModalOptions.passwordState }
        >
            <div className={classNames(style.password_input)}>
                <div className={classNames(style.label)}>{t('Введите старый пароль')}</div>
                <Input 
                    value={changePasswordData.previousPassword}
                    className={classNames(style.previousPassword)}
                    placeholder={t('Предыдущий пароль')}
                    onChange={onChangePreviousPassword}
                    errors={errors.PreviousPassword}
                />
            </div>

            <div className={classNames(style.password_input)}>
                <div className={classNames(style.label)}>{t('Введите новый пароль')}</div>
                <Input
                    value={changePasswordData.newPassword}
                    className={classNames(style.newPassword)}
                    placeholder={t('Новый пароль')}
                    onChange={onChangeNewPassword}
                    errors={errors.NewPassword}
                />
            </div>

            <div className={classNames(style.info_block)}>
                <InfoIcon/>
                <p>{t('Смена пароля аккаунта, произведет к выходу из системы со всех устройств')}</p>
            </div>
        </Modal>
            
    );
}

export default observer(PasswordModal)