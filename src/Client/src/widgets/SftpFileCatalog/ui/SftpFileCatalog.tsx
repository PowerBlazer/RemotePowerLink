import { classNames } from 'shared/lib/classNames/classNames';
import style from './SftpFileCatalog.module.scss';
import { observer } from 'mobx-react-lite';
import sftpStore from 'app/store/sftpStore';
import { Loader } from 'shared/ui/Loader/Loader';
import { SftpFileItem } from 'features/SftpFileItem';
import { SftpCatalogMode } from 'app/services/SftpService/config/sftpConfig';
import {ChangedWidthProp} from "pages/SftpPage";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";

interface SftpFileCatalogProps{
    className?: string;
    mode: SftpCatalogMode
}

function SftpFileCatalog ({ className, mode }: SftpFileCatalogProps) {
    const { t } = useTranslation('translation')
    const [isVisibleDate, setVisibleDate] = useState<boolean>(true);
    
    const selectedHost = mode === SftpCatalogMode.First
        ? sftpStore.firstSelectedHost
        : sftpStore.secondSelectedHost;

    const selectedHostFileItems = mode === SftpCatalogMode.First
        ? sftpStore.firstHostFileItems
        : sftpStore.secondHostFileItems;

    useEffect(() => {
        if(selectedHost.widthPanel){
            setVisibleDate(selectedHost.widthPanel > 460)
        }
    }, [selectedHost.widthPanel]);

    return (
        <div className={classNames(style.sftpFileCatalog, {}, [className])}>
            <div className={classNames(style.catalog_columns)}>
                <div className={classNames(style.title_column)}>
                    {t('Название Столбец')}
                </div>
                {isVisibleDate &&
                    <div className={classNames(style.date_column)}>
                        {t('Дата изменения')}
                    </div>
                }
                <div className={classNames(style.size_column)}>
                    {t('Размер')}
                </div>
                <div className={classNames(style.format_column)}>
                    {t('Тип')}
                </div>
            </div>
            <div className={classNames(style.catalog_inner)}>
                {selectedHost?.isLoad
                    ? <Loader className={classNames(style.loader)}/>
                    : selectedHostFileItems?.map((file) => {
                        return (
                            <SftpFileItem 
                                key={file.path} 
                                fileData={file} 
                                mode={mode}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
}

export default observer(SftpFileCatalog);
