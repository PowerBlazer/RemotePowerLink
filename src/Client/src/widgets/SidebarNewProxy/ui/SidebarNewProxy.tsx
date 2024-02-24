import { classNames } from 'shared/lib/classNames/classNames';
import style from './SidebarNewProxy.module.scss';
import { observer } from 'mobx-react-lite';
import { Sidebar, SidebarOptions } from 'widgets/Sidebar';
import sidebarStore from "app/store/sidebarStore";
import {Button, ThemeButton} from "shared/ui/Button/Button";
import {useEffectLoad} from "app/hooks/useLoad";
import {IdentityService} from "services/IdentityService/identityService";
import {ProxyService} from "services/ProxyService/proxyService";
import {FormBlock} from "features/FormBlock";
import {Select, SelectedItem, SelectItem} from "shared/ui/Select";
import DoubleArrow from "shared/assets/icons/double-arrow.svg";
import {useTranslation} from "react-i18next";
import ServerIcon from "shared/assets/icons/navbar/server2.svg";
import {Input} from "shared/ui/Input";
import TitleIcon from "shared/assets/icons/title.svg";
import PortIcon from "shared/assets/icons/code-working.svg";
import {ChangeEvent, useMemo, useState} from "react";
import SidebarNewIdentity from "widgets/SidebarNewIdentity/ui/SidebarNewIdentity";
import {CreateProxyData, CreateProxyResult} from "services/ProxyService/config/proxyConfig";
import {ButtonLoader} from "shared/ui/ButtonLoader";

interface SidebarNewProxyProps extends SidebarOptions<CreateProxyResult> {
    className?: string;
}

const defaultProxyData: CreateProxyData = {
    title:"",
    identityId:0,
    hostname:""
}

function SidebarNewProxy ({ className, isMain = true, onSave }: SidebarNewProxyProps) {
    const { t } = useTranslation('translation');
    const [proxyData, setProxyData] = useState<CreateProxyData>(defaultProxyData);
    const closeHandler = async () => {
        if(!isMain){
            sidebarStore.newProxyData.isVisible = false;
        }
    }

    const createIdentityHandler = () => {
        sidebarStore.newIdentityData.isVisible = true;
    }

    const selectIdentityHandler = (selectedItem:SelectedItem) => {
        setProxyData(prevData=> ({
            ...prevData,
            identityId: Number(selectedItem.id)
        }));
    }

    const hostnameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setProxyData(prevData => ({
            ...prevData,
            hostname: e.target.value
        }));
    }

    const nameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setProxyData(prevData => ({
            ...prevData,
            title: e.target.value
        }));
    }

    const portChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setProxyData(prevData => ({
            ...prevData,
            port: Number(e.target.value)
        }));
    }

    const createProxyClickHandler = async () => {
        const createProxyResult = await ProxyService.createProxy(proxyData);

        if(onSave && createProxyResult.isSuccess){
            await onSave(createProxyResult.result);
        }
    }

    const { isLoad } = useEffectLoad(async ()=> {
        if(!sidebarStore.newProxyData.identities){
            const identitiesResult = await IdentityService.getIdentities();
            sidebarStore.newProxyData.identities = identitiesResult.result;
        }
    });

    const sidebars = useMemo(() => [
        <SidebarNewIdentity key="identity" isMain={false} />
    ],[]);
    
    return (
        <Sidebar
            className={classNames(style.sidebarNewProxy, {
                [style.active]: (sidebarStore.newProxyData?.isVisible && !isMain),
            }, [className])}
            sidebars={isMain && sidebars}
            headerName={'Новый прокси сервер'}
            close={closeHandler}
            isLoad={isLoad}
            isMain={isMain}
            
        >
            <div className={classNames(style.content)}>
                <div className={classNames(style.content_inner)}>
                    <FormBlock headerName={'Адресс'}>
                        <div className={classNames(style.address_block)}>
                            <div className={classNames(style.icon_server)}>
                                <ServerIcon width={24} height={24}/>
                            </div>
                            <Input
                                type={"text"}
                                className={style.address_input}
                                placeholder={t('IP или домен')}
                                onChange={hostnameChangeHandler}
                            />
                        </div>
                    </FormBlock>
                    <FormBlock className={classNames(style.general_block)} headerName={'Главная'}>
                        <div className={classNames(style.general_block)}>
                            <Input
                                type={"text"}
                                className={classNames(style.title_input)}
                                placeholder={t('Название')}
                                icon={<TitleIcon width={20} height={20}/>}
                                onChange={nameChangeHandler}
                            />
                            <Input
                                type={"text"}
                                className={classNames(style.port_input)}
                                placeholder={t('Ssh порт')}
                                icon={<PortIcon width={20} height={20}/>}
                                onChange={portChangeHandler}
                            />
                        </div>
                    </FormBlock>
                    <FormBlock className={classNames(style.identity_block)} headerName={'Учетные данные'}>
                        <Select
                            placeholder={'Выбрать учетку'}
                            icon={<DoubleArrow width={19} height={19}/>}
                            onChange={selectIdentityHandler}
                        >
                            {sidebarStore.newProxyData.identities?.map((proxy) =>
                                <SelectItem
                                    key={proxy.id}
                                    selectedItem={{id: proxy.id.toString(), title: proxy.title}}
                                />
                            )}
                        </Select>
                        <Button
                            className={classNames(style.create_identity)}
                            theme={ThemeButton.PRIMARY}
                            onClick={createIdentityHandler}
                        >
                            {t("Создать учетку")}
                        </Button>
                    </FormBlock>
                </div>
                <div className={classNames(style.save_block)}>
                    <ButtonLoader
                        className={classNames(style.create_newhost)}
                        theme={ThemeButton.PRIMARY}
                        onClick={createProxyClickHandler}
                    >
                        {t("Создать прокси сервер")}
                    </ButtonLoader>
                </div>
            </div>
        </Sidebar>
    );
}

export default observer(SidebarNewProxy);
