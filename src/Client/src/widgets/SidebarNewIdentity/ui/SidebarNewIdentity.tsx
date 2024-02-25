import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarNewIdentity.module.scss';
import { observer } from 'mobx-react-lite';
import { Sidebar, SidebarOptions } from 'widgets/Sidebar';
import sidebarStore from "app/store/sidebarStore";
import {CreateIdentityData, CreateIdentityResult} from "services/IdentityService/config/identityConfig";
import {ButtonLoader} from "shared/ui/ButtonLoader";
import {ThemeButton} from "shared/ui/Button/Button";
import {ChangeEvent, useState} from "react";
import {useTranslation} from "react-i18next";
import {Input} from "shared/ui/Input";
import {FormBlock} from "features/FormBlock";
import UserCard from "shared/assets/icons/user-card.svg";
import {IdentityService} from "services/IdentityService/identityService";

interface SidebarNewIdentityProps extends SidebarOptions<CreateIdentityResult> {
    className?: string;
}

const defaultIdentityData: CreateIdentityData = {
    title:"",
    username:"",
    password:""
}

function SidebarNewIdentity ({ className, isMain = true, onSave }: SidebarNewIdentityProps) {

    const { t } = useTranslation('translation');
    const [identityData, setIdentityData] = useState<CreateIdentityData>(defaultIdentityData);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const closeHandler = async () => {
        if(!isMain){
            sidebarStore.newIdentityData.isVisible = false;
        }
    }
    
    const nameChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        setIdentityData(prevData => ({
            ...prevData,
            title: e.target.value
        }));

        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors["Title"];
            return updatedErrors;
        });
    }

    const usernameChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        setIdentityData(prevData => ({
            ...prevData,
            username: e.target.value
        }));

        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors["Username"];
            return updatedErrors;
        });
    }

    const passwordChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        setIdentityData(prevData => ({
            ...prevData,
            password: e.target.value
        }));

        setErrors(prevValue => {
            const updatedErrors = { ...prevValue };
            delete updatedErrors["Password"];
            return updatedErrors;
        });
    }
    
    const createIdentityClickHandler = async () => {
       const createIdentityResult = await IdentityService.createIdentity(identityData);

        if(onSave && createIdentityResult.isSuccess){
            await onSave(createIdentityResult.result);
        }

        if(!createIdentityResult.isSuccess){
            setErrors(createIdentityResult?.errors);
        }
    }
    
    return (
        <Sidebar
            className={classNames(style.sidebarNewProxy, {
                [style.active]: (sidebarStore.newIdentityData?.isVisible)
            }, [className])}
            isMain={isMain}
            headerName={'Новый иденитификатор'}
            close={closeHandler}
        >
            <div className={classNames(style.content)}>
                <div className={classNames(style.content_inner)}>
                    <FormBlock className={classNames(style.general_block)} headerName={'Главная'}>
                        <div className={classNames(style.general_block)}>
                            <div className={classNames(style.title_block)}>
                                <div className={classNames(style.icon_server)}>
                                    <UserCard width={35} height={35}/>
                                </div>
                                <Input
                                    type={"text"}
                                    className={style.title_input}
                                    placeholder={t('Название')}
                                    onChange={nameChangeHandler}
                                    errors={errors.Title ?? null}
                                />
                            </div>
                            <Input
                                type={"text"}
                                className={classNames(style.username_input)}
                                placeholder={t('Имя пользователя')}
                                onChange={usernameChangeHandler}
                                errors={errors?.Username ?? null}
                            />
                            <Input
                                type={"password"}
                                className={classNames(style.username_input)}
                                placeholder={t('Пароль')}
                                onChange={passwordChangeHandler}
                                errors={errors?.Password ?? null}
                            />
                        </div>
                    </FormBlock>
                </div>
                <div className={classNames(style.save_block)}>
                    <ButtonLoader
                        className={classNames(style.create_newhost)}
                        theme={ThemeButton.PRIMARY}
                        actionAsync={createIdentityClickHandler}
                        disabled={Object.keys(errors).length > 0}
                    >
                        {t("Создать идентификатор")}
                    </ButtonLoader>
                </div>
            </div>
        </Sidebar>
    );
}

export default observer(SidebarNewIdentity)
