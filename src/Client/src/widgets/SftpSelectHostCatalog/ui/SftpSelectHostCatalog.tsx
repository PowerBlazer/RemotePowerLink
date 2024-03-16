import {classNames} from 'shared/lib/classNames/classNames';
import style from './SftpSelectHostCatalog.module.scss';
import {ServerManagerCatalog} from "widgets/ServerManagerCatalog";
import {ServerManagerCatalogMode} from "widgets/ServerManagerCatalog/ui/ServerManagerCatalog";
import sftpStore from "app/store/sftpStore";
import userStore from "app/store/userStore";
import {Button} from "shared/ui/Button/Button";
import ArrowRight from "shared/assets/icons/arrow-right.svg";
import SearchIcon from 'shared/assets/icons/search.svg';
import {useTranslation} from "react-i18next";
import {ChangeEvent, useEffect} from "react";
import searchStore from "app/store/searchStore";

interface SftpSelectHostCatalogProps {
    className?: string;
    onClose?: () => void
}

export function SftpSelectHostCatalog ({ className, onClose }: SftpSelectHostCatalogProps) {
    const { t } = useTranslation('translation');

    useEffect(() => {
        searchStore.setFilterOption(null)
    }, []);
    
    const onChangeSearchInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        searchStore.setFilterOption({
            title: e.target.value
        })
    }
    
    const onClickCloseSelectHostCatalog = () => {
        if(onClose){
            onClose();
        }
    }
    
    return (
        <div className={classNames(style.sftpSelectHostCatalog, {}, [className])}>
            <div className={classNames(style.select_navbar)}>
                <div className={classNames(style.header_navbar)}>
                    <Button className={classNames(style.close)} onClick={onClickCloseSelectHostCatalog}>
                        <ArrowRight width={17} height={17}></ArrowRight>
                    </Button>
                    <h3 className={classNames(style.header_text)}>{t('Выбрать сервер')}</h3>
                </div>
                <div className={classNames(style.search_catalog_panel)}>
                    <div className={classNames(style.search_content)}>
                        <div className={classNames(style.search_icon)}>
                            <SearchIcon width={17} height={17}/>
                        </div>
                        <input 
                            type="text" 
                            className={classNames(style.search_input)} 
                            placeholder={t("Поиск")}
                            onChange={onChangeSearchInputHandler}
                        />
                    </div>
                    <div className={style.tools}></div>
                </div>
            </div>
            
            <ServerManagerCatalog mode={ServerManagerCatalogMode.Sftp}/>
		</div>
    );
}