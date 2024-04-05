import { classNames } from 'shared/lib/classNames/classNames';
import style from './ButtonDelete.module.scss';
import { Button } from 'shared/ui/Button/Button';
import BasketIcon from 'shared/assets/icons/basket.svg';
import { DataTypeEnum } from 'app/enums/DataTypeEnum';
import { ServerService } from 'app/services/ServerService/serverService';
import toast from 'react-hot-toast';
import { ProxyService } from 'app/services/ProxyService/proxyService';
import { IdentityService } from 'app/services/IdentityService/identityService';
import userStore from 'app/store/userStore';
import sidebarStore from 'app/store/sidebarStore';
import {useTranslation} from "react-i18next";

interface ButtonDeleteProps {
    className?: string;
    dataType: DataTypeEnum,
    dataId: number
}

export function ButtonDelete ({ className, dataType, dataId }: ButtonDeleteProps) {
    const { t } = useTranslation('translation')
    const deleteClickHandler = () => {
        toast.promise(
            deleteData(),
            {
                loading: t('Удаление...'),
                success: <b>{t('Успешно удалено')}</b>,
                error: <b>{t('Не удалось удалить, повторите попытку позже')}</b>
            }
        );

        async function deleteData () {
            if (dataType === DataTypeEnum.SERVER) {
                const deleteResult = await ServerService.deleteServer(dataId);

                if (deleteResult.isSuccess) {
                    userStore.removeUserServer(dataId);
                    await sidebarStore.setSidebar(null);
                }

                if (!deleteResult.isSuccess) {
                    throw new Error();
                }
            }

            if (dataType === DataTypeEnum.PROXY) {
                const deleteResult = await ProxyService.deleteProxy(dataId);

                if (deleteResult.isSuccess) {
                    userStore.removeUserProxy(dataId);
                    await sidebarStore.setSidebar(null);
                }

                if (!deleteResult.isSuccess) {
                    throw new Error();
                }
            }

            if (dataType === DataTypeEnum.IDENTITY) {
                const deleteResult = await IdentityService.deleteIdentity(dataId);

                if (deleteResult.isSuccess) {
                    userStore.removeUserIdentity(dataId);
                    await sidebarStore.setSidebar(null);
                }

                if (!deleteResult.isSuccess) {
                    throw new Error();
                }
            }
        }
    }

    return (
        <Button className={classNames(style.buttonDelete, {}, [className])} onClick={deleteClickHandler}>
            <BasketIcon width={22} height={22} fill={'#d04040'}/>
        </Button>
    );
}
