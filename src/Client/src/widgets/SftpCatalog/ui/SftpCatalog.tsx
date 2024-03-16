import {classNames} from 'shared/lib/classNames/classNames';
import style from './SftpCatalog.module.scss';
import {observer} from "mobx-react-lite";
import sftpStore from "app/store/sftpStore";
import {useCallback, useMemo, useState} from "react";
import LogoIcon from 'shared/assets/icons/logo.svg';
import {Button, ThemeButton} from "shared/ui/Button/Button";
import {useTranslation} from "react-i18next";
import {SftpSelectHostCatalog} from "widgets/SftpSelectHostCatalog";

export enum SftpCatalogMode {
    First = 'FIRST',
    Second = 'SECOND'
}

interface SftpCatalogProps {
    className?: string;
    mode: SftpCatalogMode
}

function SftpCatalog ({ className, mode }: SftpCatalogProps) {
    const { t } = useTranslation('translation');
    const [isViewServersCatalog, setIsView] = useState<boolean>(false);

    const getIsSelectedServer = () => {
        if(mode === SftpCatalogMode.First && sftpStore.firstSelectedHost != null){
            return true;
        }

        return mode === SftpCatalogMode.Second && sftpStore.secondSelectedHost != null;
    }
    
    const selectHostInformationBlock = useMemo(() => (
        <div className={classNames(style.host_information_block)}>
            <LogoIcon width={180} height={156}/>
            <div className={classNames(style.information_content)}>
                <div className={classNames(style.header_information)}>
                    <h1>{t('Подключиться к серверу')}</h1>
                    <h3>{t('Выберите из вашего сохраненного сервера')}</h3>
                </div>
                <Button 
                    className={classNames(style.select_server)} 
                    theme={ThemeButton.PRIMARY}
                    onClick={() => setIsView(true)}
                >
                    {t('Выбрать сервер')}
                </Button>
            </div>
        </div>
    ), []);
    
    return (
        <div className={classNames(style.sftpCatalog, {}, [className])}>
            {getIsSelectedServer() === false && !isViewServersCatalog && selectHostInformationBlock}
            {isViewServersCatalog && <SftpSelectHostCatalog onClose={()=> setIsView(false)}/> }
		</div>
    );
}

export default observer(SftpCatalog)